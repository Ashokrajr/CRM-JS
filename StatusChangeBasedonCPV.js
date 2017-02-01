// Extend the Date Object to give Day of the Year
Date.prototype.getDOY = function() {
	var onejan = new Date(this.getFullYear(),0,1);
	return Math.ceil((this - onejan) / 86400000);
}

// Get the Days in Year for the Year Passed
function daysInYear(year) {

    // Leap Year
    if(year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) {
        return 366;
    } 
	
	// Not A Leap Year
	else { 
        return 365;
    }
	
}

//Set Salesperson to Current Logged in User//
function setSalesperson() {
    if (Xrm.Page.ui.getFormType() == 1) {
        var pageContext = Xrm.Page.context;
        var userID = pageContext.getUserId();
        var userName = pageContext.getUserName();

        if (userName != null || userName != "") {
            var setUserValue = new Array();
            setUserValue[0] = new Object();
            setUserValue[0].id = userID;
            setUserValue[0].entityType = 'systemuser';
            setUserValue[0].name = userName;

            Xrm.Page.getAttribute("nha_salesperson").setValue(setUserValue);
        }
    }
}

//Set Hide certain fields on the Opportunity Product form
function hideFieldsOnForm() {
	Xrm.Page.ui.controls.get("productdescription").setVisible(false);
}

//Calculate Close Probability Weighted Annual Revenue (current year)//
function CalcProbWghtAnnRevCrntYr() {

	// Date For Revenue Impact
	var dateforrevenueimpact = Xrm.Page.getAttribute("nha_dateforrevenueimpact").getValue();
	
	// Date For Revenue Impact Day of Year
	var dateforrevenueimpact_doy;
	var days_in_dateforrevenueimpact_year;
	if (dateforrevenueimpact != null) { 
		dateforrevenueimpact_doy = dateforrevenueimpact.getDOY();
		days_in_dateforrevenueimpact_year = daysInYear(dateforrevenueimpact.getFullYear());
	}
	
	// Get Probability Weighted Annual Revenue
	var probWghtAnnRev = Xrm.Page.getAttribute("nha_probabilityweightedannualrevenue").getValue();
	if (probWghtAnnRev != null) {
	
		// Calculation Factor Per Matt (2/14/2014)
		// Use This Method: (365 � day of year for revenue impact)/365
		var calculation_factor = (days_in_dateforrevenueimpact_year - dateforrevenueimpact_doy) / days_in_dateforrevenueimpact_year;
		
		
		// Set Probability Weighted Annual Revenue (Current Year)
		Xrm.Page.getAttribute("nha_probabilityweightedannualrevenuecurrentyr").setValue(probWghtAnnRev * calculation_factor);
		Xrm.Page.getAttribute("nha_probabilityweightedannualrevenuecurrentyr").setSubmitMode("always");
	
	}
	
}

//Calculate Gross Annual Revenue//

function CalcEstGrsAnnRev() {
    var numofstudents = Xrm.Page.getAttribute("nha_numberofstudentsannualized").getValue();
    var estrevperstudent = Xrm.Page.getAttribute("nha_productpriceperstudent").getValue();
    var calculate = numofstudents * estrevperstudent;

    Xrm.Page.getAttribute("nha_grossannualrevenue").setValue(calculate);
    Xrm.Page.getAttribute("nha_grossannualrevenue").setSubmitMode("always");
}

//Calculate Close Probability Weighted Annual Revenue//

function CalcProbWghtAnnRev() {
    var estgrsannrev = Xrm.Page.getAttribute("nha_grossannualrevenue").getValue();
    var clsprob = Xrm.Page.getAttribute("nha_closeprobability").getValue();
    var probwghtannrev = Xrm.Page.getAttribute("nha_probabilityweightedannualrevenue").getValue();

    var calculatezero = estgrsannrev * 0;
    var calculatetwentyfive = estgrsannrev * 0.25;
    var calculatefifty = estgrsannrev * 0.5;
    var calculateseventyfive = estgrsannrev * 0.75;
    var calculateonehundred = estgrsannrev * 1;

    if (clsprob == 126990000) {
        Xrm.Page.getAttribute("nha_probabilityweightedannualrevenue").setValue(calculatezero);
Xrm.Page.getAttribute("nha_status").setValue(126990002);//Set status as Lost
Xrm.Page.getAttribute("nha_status").fireOnChange();
Xrm.Page.getAttribute("nha_status").setSubmitMode("always");
        Xrm.Page.getAttribute("nha_probabilityweightedannualrevenue").setSubmitMode("always");
    } else if (clsprob == 126990001) {
        Xrm.Page.getAttribute("nha_probabilityweightedannualrevenue").setValue(calculatetwentyfive);
Xrm.Page.getAttribute("nha_status").setValue(126990000);//Set status as Open
Xrm.Page.getAttribute("nha_status").fireOnChange();
Xrm.Page.getAttribute("nha_status").setSubmitMode("always");
        Xrm.Page.getAttribute("nha_probabilityweightedannualrevenue").setSubmitMode("always");
    } else if (clsprob == 126990002) {
        Xrm.Page.getAttribute("nha_probabilityweightedannualrevenue").setValue(calculatefifty);
Xrm.Page.getAttribute("nha_status").setValue(126990000);//Set status as Open
Xrm.Page.getAttribute("nha_status").fireOnChange();
Xrm.Page.getAttribute("nha_status").setSubmitMode("always");
        Xrm.Page.getAttribute("nha_probabilityweightedannualrevenue").setSubmitMode("always");
    } else if (clsprob == 126990003) {
        Xrm.Page.getAttribute("nha_probabilityweightedannualrevenue").setValue(calculateseventyfive);
Xrm.Page.getAttribute("nha_status").setValue(126990000);//Set status as Open
Xrm.Page.getAttribute("nha_status").fireOnChange();
Xrm.Page.getAttribute("nha_status").setSubmitMode("always");
        Xrm.Page.getAttribute("nha_probabilityweightedannualrevenue").setSubmitMode("always");
    } else if (clsprob == 126990004) {
        Xrm.Page.getAttribute("nha_probabilityweightedannualrevenue").setValue(calculateonehundred);
Xrm.Page.getAttribute("nha_status").setValue(126990001);//Set status as Won
Xrm.Page.getAttribute("nha_status").fireOnChange();
Xrm.Page.getAttribute("nha_status").setSubmitMode("always");
        Xrm.Page.getAttribute("nha_probabilityweightedannualrevenue").setSubmitMode("always");
    }
}

function CheckForEstimatedRevenueDateRequirement() {

	// Date For Revenue Impact
	var dateforrevenueimpact = Xrm.Page.getAttribute("nha_dateforrevenueimpact").getValue();
	
	// Close Probability
	var probability = Xrm.Page.getAttribute("nha_closeprobability").getValue();
	
	// The Estimated Revenue Date should be required if the close probability = 50+% and optional if <50%
	if (probability == 126990002 || probability == 126990003 || probability == 126990004) {
		Xrm.Page.getAttribute("nha_dateforrevenueimpact").setRequiredLevel("required");
	} else {
		Xrm.Page.getAttribute("nha_dateforrevenueimpact").setRequiredLevel("none");
	}
	
	if (dateforrevenueimpact == null) {
        Xrm.Page.getAttribute("nha_probabilityweightedannualrevenuecurrentyr").setValue(0);
	}
	
}

function SetLastMovementDates() {

	// Last Stage Fields
	var laststage = Xrm.Page.getAttribute("nha_laststage").getValue();
	var laststagemovement = Xrm.Page.getAttribute("nha_laststagemovement").getValue();
	
	// Close Probability (the stage)
	var closeprobability = Xrm.Page.getAttribute("nha_closeprobability").getValue();
		
	// If the last stage is not equal to the current stage (this will take care 
	// of the NULL state too), then set it to the current stage
	if (laststage != closeprobability) {
		Xrm.Page.getAttribute("nha_laststage").setValue(closeprobability);
        Xrm.Page.getAttribute("nha_laststage").setSubmitMode("always");
		
		Xrm.Page.getAttribute("nha_laststagemovement").setValue(new Date());
		Xrm.Page.getAttribute("nha_laststagemovement").setSubmitMode("always");
	}
}



// A Function is called when value of "Close Probability" field modified.

function setCloseProbabilityLog()
{
	var pageContext = Xrm.Page.context;
    var userID = pageContext.getUserId();
    var userName = pageContext.getUserName();
	var currentDateTime = new Date();
	var setUserValue = new Array();
    var closeprob = Xrm.Page.getAttribute("nha_closeprobability");
	
    var isCloseProbChanged = closeprob.getIsDirty();
	
	if(isCloseProbChanged == true)						// Checking for value change for Close Probability attribute.
	{
		var CloseProbVal = closeprob.getValue();

		if (userName != null || userName != "") 		// Creating Current User Object
		{
			setUserValue[0] = new Object();
			setUserValue[0].id = userID;
			setUserValue[0].entityType = 'systemuser';
			setUserValue[0].name = userName;
		}
	
		if(CloseProbVal != null && setUserValue != null && currentDateTime != null)
		{
			switch (CloseProbVal) 
			{
				case 126990000:  // Close Probability = 0%
					Xrm.Page.getAttribute("nha_closeprobabilitymodifiedby0").setValue(setUserValue);
					Xrm.Page.getAttribute("nha_closeprobabilitymodifiedon0").setValue(currentDateTime);
					break;
				case 126990001:  // Close Probability = 25%
					Xrm.Page.getAttribute("nha_closeprobabilitymodifiedby25").setValue(setUserValue);
					Xrm.Page.getAttribute("nha_closeprobabilitymodifiedon25").setValue(currentDateTime);
					break;
				case 126990002:  // Close Probability = 50%
					Xrm.Page.getAttribute("nha_closeprobabilitymodifiedby50").setValue(setUserValue);
					Xrm.Page.getAttribute("nha_closeprobabilitymodifiedon50").setValue(currentDateTime);
					break;
				case 126990003:  // Close Probability = 75%
					Xrm.Page.getAttribute("nha_closeprobabilitymodifiedby75").setValue(setUserValue);
					Xrm.Page.getAttribute("nha_closeprobabilitymodifiedon75").setValue(currentDateTime);
					break;
				case 126990004:  // Close Probability = 100%
					Xrm.Page.getAttribute("nha_closeprobabilitymodifiedby100").setValue(setUserValue);
					Xrm.Page.getAttribute("nha_closeprobabilitymodifiedon100").setValue(currentDateTime);
					break;	
			}		
		}
	}
}


//Clear the value for Lost to Competitor

function statusReasonOnchange()
{

Xrm.Page.getAttribute("nha_wonreason").setValue("null");
wonToCompetitorOnchange();

     Xrm.Page.getAttribute("nha_lostreason").setValue("");
     Xrm.Page.getAttribute("nha_wonreason").setValue("");

 //var clsprob = Xrm.Page.getAttribute("nha_closeprobability").getValue();

/*if((Xrm.Page.getAttribute("nha_status").getValue())== 126990001)
{
  Xrm.Page.getAttribute("nha_closeprobability").setValue(126990004) ;
}

if((Xrm.Page.getAttribute("nha_status").getValue())==126990002)
{
  Xrm.Page.getAttribute("nha_closeprobability").setValue(126990000) ;
}

if((Xrm.Page.getAttribute("nha_status").getValue())==126990003)
{
  Xrm.Page.getAttribute("nha_closeprobability").setValue(126990000) ;
}

CalcProbWghtAnnRev();
CalcEstGrsAnnRev();
CalcProbWghtAnnRevCrntYr();
CheckForEstimatedRevenueDateRequirement();

*/
   //Calling Close Probabilty function
  // Xrm.Page.getAttribute(“nha_statusReasoncode”).fireOnChange();
  //Xrm.Page.getAttribute(“nha_statusreasoncode”).fireOnChange();
  //if((Xrm.Page.getAttribute("nha_statusreasoncode").getSelectedOption()) == null) ;
   //{Xrm.Page.getAttribute("nha_closeprobability").setValue("") ; }
}

function lostToCompetitorOnchange()
{
     Xrm.Page.getAttribute("nha_primaryreasonforlost").setValue("");
     Xrm.Page.getAttribute("nha_specifycompetitor").setValue("");
}

function primaryLostReasonOnchange()
{
 Xrm.Page.getAttribute("nha_other_primaryreason").setValue("");
}

function specifyCompetitorOnchange()
{
 Xrm.Page.getAttribute("nha_other_specifycompetitor").setValue("");
}





function WonReasonChange(chk)
{
	Xrm.Page.ui.clearFormNotification("1");
	
	var wonReason = Xrm.Page.getAttribute("nha_wonreason").getValue();
	var statusReason = Xrm.Page.getAttribute("nha_status").getValue();
	var checkResult = [];
	var checkFields = ["nha_multiplecertificationofferings", "nha_certprepproducts", "nha_examquality", "nha_onsitetesting", "nha_analytics", "nha_industryawareness", "nha_customerservice"];
	var cnt=0;
	
	if(statusReason == 126990001 && wonReason == 126990002)
	{
		for(var j = 0; j<checkFields.length; j++)
		{
			checkResult[j] = Xrm.Page.getAttribute(checkFields[j]).getValue();
			
			if(checkResult[j] == true)
			{
				cnt++;
			}
		}
		
		if(cnt == 0)
		{
			for(var j = 0; j<checkFields.length; j++)
			{
				checkResult[j] = Xrm.Page.getAttribute(checkFields[j]).setRequiredLevel("required");
				
				if(checkResult[j] == true)
				{
					cnt++;
				}
			}
		}
		else if(cnt == 1)
		{
			for(var j = 0; j<checkFields.length; j++)
			{
				checkResult[j] = Xrm.Page.getAttribute(checkFields[j]).setRequiredLevel("none");
				
				if(checkResult[j] == true)
				{
					cnt++;
				}
			}
		}
		
		if(cnt > 2)
		{
			var checkbox = chk.getEventSource().getValue();
			Xrm.Page.ui.setFormNotification("You should choose maximum of 2 and atleast 1 Won Reason.", "WARNING", "1")
			if(checkbox == true)
			{
				chk.getEventSource().setValue("false");
			}
		}
	}	
}

//======================================================================================

function WonReasonCheckonSave(econtext)
{
	Xrm.Page.ui.clearFormNotification("2");
	var wonReason = Xrm.Page.getAttribute("nha_wonreason").getValue();
	var statusReason = Xrm.Page.getAttribute("nha_status").getValue();
	var checkResult = [];
	var checkFields = ["nha_multiplecertificationofferings", "nha_certprepproducts", "nha_examquality", "nha_onsitetesting", "nha_analytics", "nha_industryawareness", "nha_customerservice"];
	var cnt=0;
	
	if(statusReason == 126990001 && wonReason == 126990002)
	{
		for(var j = 0; j<checkFields.length; j++)
		{
			checkResult[j] = Xrm.Page.getAttribute(checkFields[j]).getValue();
			
			if(checkResult[j] == true)
			{
				cnt++;
			}
		}
		
		if(cnt==0)
		{
			Xrm.Page.ui.setFormNotification("You should choose atleast 1 Won Reason.", "ERROR", "2");
			var eventArgs = econtext.getEventArgs();
			if (eventArgs.getSaveMode() == 1 || eventArgs.getSaveMode() == 70 || eventArgs.getSaveMode() == 2) 
			{
				eventArgs.preventDefault();
			}
		}
	}

}



function wonToCompetitorOnchange()
{

          Xrm.Page.getAttribute("nha_specifycompetitor").setValue("");
	//Xrm.Page.getAttribute("nha_primaryreasonforwon").setValue("");
	  var wonReason = Xrm.Page.getAttribute("nha_wonreason").getValue();

	  var checkFields = ["nha_multiplecertificationofferings", "nha_certprepproducts", "nha_examquality", "nha_onsitetesting", "nha_analytics", "nha_industryawareness", "nha_customerservice"];

		for(var j = 0; j<checkFields.length; j++)
		{
			Xrm.Page.getAttribute(checkFields[j]).setValue("");
                       if(wonReason == 126990002)
			{	
                        //Xrm.Page.getAttribute(checkFields[j]).setRequiredLevel("required");
			}
		       else
			{
                        Xrm.Page.getAttribute(checkFields[j]).setRequiredLevel("none");			
			}
		}

}




function MakeFormReadOnly()
{
       var formType = Xrm.Page.ui.getFormType();	   
	var stsReason  = Xrm.Page.getAttribute("nha_status").getValue();	
var optionsetText = Xrm.Page.getAttribute("nha_status").getText();
	if (stsReason == 126990001|| stsReason == 126990002 || stsReason == 126990003 ){
      Xrm.Page.ui.setFormNotification("Product Status is :- " + optionsetText + ". Hence the form is Read only!","WARNING", "3")
	Xrm.Page.data.entity.attributes.forEach(function (attribute, index) {    
                var control = Xrm.Page.getControl(attribute.getName());
                    if (control) {
                    control.setDisabled(true)
                                        }
	});
Xrm.Page.ui.tabs.get("general").sections.get("opportunity product information").setVisible(false);
	}
	
}


//Hide and Showing Fields
function hideandshowFields() {
    //Defining Variables
    var sts = Xrm.Page.getAttribute("nha_status").getValue();//Getting Status values
    var wonReason = Xrm.Page.getAttribute("nha_wonreason").getValue();//Get Wonreason Value
    var lostReason = Xrm.Page.getAttribute("nha_lostreason").getValue();//Get lostreason Value;
    var speicifyComp = Xrm.Page.getAttribute("nha_specifycompetitor").getValue(); //Get specifiy comp value
    var primaryReasonforLost = Xrm.Page.getAttribute("nha_primaryreasonforlost").getValue(); // Get the primaryReasonforLost
refreshWonReasonWebResource();

    //Hiding All the Fields on function call
    Xrm.Page.ui.controls.get("nha_wonreason").setVisible(false);
    Xrm.Page.ui.controls.get("nha_lostreason").setVisible(false); //Hide lost Reason
    Xrm.Page.ui.controls.get("nha_primaryreasonforlost").setVisible(false); //Hide Primary Reason for lost
    Xrm.Page.ui.controls.get("nha_other_primaryreason").setVisible(false); //Hide Other Primary Reason
    Xrm.Page.ui.controls.get("nha_specifycompetitor").setVisible(false); //Hide Specify Competitior
    Xrm.Page.ui.controls.get("nha_other_specifycompetitor").setVisible(false); //Hide Other Specify Competitior
    //Xrm.Page.ui.tabs.get("general").sections.get("decidingfactors").setVisible(false); //Hide Deciding Factor Section
    Xrm.Page.ui.controls.get("WebResource_WonReasonDropDown").setVisible(false); //Hide Won Reason WebResource Reason

    //Setting fields as Optional on function call
    Xrm.Page.getAttribute("nha_wonreason").setRequiredLevel("none");
    Xrm.Page.getAttribute("nha_lostreason").setRequiredLevel("none");
    Xrm.Page.getAttribute("nha_primaryreasonforlost").setRequiredLevel("none");
    Xrm.Page.getAttribute("nha_other_primaryreason").setRequiredLevel("none");
    Xrm.Page.getAttribute("nha_specifycompetitor").setRequiredLevel("none");
    Xrm.Page.getAttribute("nha_other_specifycompetitor").setRequiredLevel("none");

    if (sts == 126990001) //Won Status
    {
        Xrm.Page.ui.controls.get("nha_wonreason").setVisible(true); //Show only One Reason and Make it as Mandatory	
        Xrm.Page.getAttribute("nha_wonreason").setRequiredLevel("required");

        if (wonReason == 126990002) // if Wonreason is Won from competitor
        {
            Xrm.Page.ui.controls.get("nha_specifycompetitor").setVisible(true); //Show Specify Competitior
            Xrm.Page.getAttribute("nha_specifycompetitor").setRequiredLevel("required");

            if (speicifyComp == 126990017)//if Specifiy Competitor is Other 
            {
                Xrm.Page.ui.controls.get("nha_other_specifycompetitor").setVisible(true); //Show Other Specify Competitior		
                //Xrm.Page.ui.tabs.get("general").sections.get("decidingfactors").setVisible(true);
                Xrm.Page.ui.controls.get("WebResource_WonReasonDropDown").setVisible(true); //Hide Won Reason WebResource Reason
                Xrm.Page.getAttribute("nha_other_specifycompetitor").setRequiredLevel("required");	
            }

            if (speicifyComp != null)
            {
                //Xrm.Page.ui.tabs.get("general").sections.get("decidingfactors").setVisible(true);
                Xrm.Page.ui.controls.get("WebResource_WonReasonDropDown").setVisible(true); //Hide Won Reason WebResource Reason
            }

        }
    }
    else if (sts == 126990002)//Lost Status
    {

        Xrm.Page.ui.controls.get("nha_lostreason").setVisible(true); //Show lost Reason	
        Xrm.Page.getAttribute("nha_lostreason").setRequiredLevel("required");
        if (lostReason == 126990002)// if lost reason is Lost to Competitior
        {
            Xrm.Page.ui.controls.get("nha_primaryreasonforlost").setVisible(true); //Show Primary Reason for lost
            Xrm.Page.ui.controls.get("nha_specifycompetitor").setVisible(true); //show Specify Competitior
            Xrm.Page.getAttribute("nha_primaryreasonforlost").setRequiredLevel("required");
            Xrm.Page.getAttribute("nha_specifycompetitor").setRequiredLevel("required");

            if (primaryReasonforLost == 126990004) //if Primary Reason for lost is Other
            {
                Xrm.Page.ui.controls.get("nha_other_primaryreason").setVisible(true);
                Xrm.Page.getAttribute("nha_other_primaryreason").setRequiredLevel("required");
            }
            if (speicifyComp == 126990017)//if Specifiy Competitor is Other 
            {
                Xrm.Page.ui.controls.get("nha_other_specifycompetitor").setVisible(true); //Show Other Specify Competitior		
                Xrm.Page.getAttribute("nha_other_specifycompetitor").setRequiredLevel("required");
            }

        }

    }

    else {
        //hiding all fields if status is not Won / Lost
        Xrm.Page.ui.controls.get("nha_wonreason").setVisible(false); //Show only One Reason and Make it as Mandatory
        Xrm.Page.ui.controls.get("nha_lostreason").setVisible(false); //Hide lost Reason
        //Xrm.Page.ui.tabs.get("general").sections.get("decidingfactors").setVisible(false);
        Xrm.Page.ui.controls.get("WebResource_WonReasonDropDown").setVisible(false); //Hide Won Reason WebResource Reason
        Xrm.Page.ui.controls.get("nha_primaryreasonforlost").setVisible(false); //Hide Primary Reason for lost
        Xrm.Page.ui.controls.get("nha_other_primaryreason").setVisible(false); //Hide Other Primary Reason
        Xrm.Page.ui.controls.get("nha_specifycompetitor").setVisible(false); //Hide Specify Competitior
        Xrm.Page.ui.controls.get("nha_other_specifycompetitor").setVisible(false); //Hide Other Specify Competitior	
    }

}


//Prevent Over 31 Days manual selection

function preventOver31Days()
{
	Xrm.Page.ui.clearFormNotification("4");
	var lostReason = Xrm.Page.getAttribute("nha_lostreason").getValue();
	if(lostReason == 126990006 )//lostReason is Over31days
	{	
			Xrm.Page.ui.setFormNotification("Please Select Reason except Over 31 Days ", "WARNING", "4")
			Xrm.Page.getAttribute("nha_lostreason").setValue(null);
	}
}


function refreshonSave()
{
var stsReason  = Xrm.Page.getAttribute("nha_status").getValue();		
if (stsReason == 126990001|| stsReason == 126990002 || stsReason == 126990003 )
{
		Xrm.Page.data.entity.save();
	    location.reload(true);
	}
}

function refreshWonReasonWebResource() 
{
    var webResourceControl = Xrm.Page.getControl("WebResource_WonReasonDropDown");
    var src = webResourceControl.getSrc();
    webResourceControl.setSrc(null);
    webResourceControl.setSrc(src);
}

// Status field is Read only Except SysAdmin
function PreventStatus()
{
	var logonUserRole = Xrm.Page.context.getUserRoles();
        var sts = Xrm.Page.getAttribute("nha_status").getValue();
	if(sts==126990000)
	{
	for(var i =0 ; i<logonUserRole.length; i++)
		{
			if(logonUserRole[i] == "e1c6796b-1116-e311-8ddc-b4b52f67d656" )
			{
			Xrm.Page.ui.controls.get("nha_status").setDisabled (false);
			}							
		}
     }
}