$(window).load(function(){
	$("#runcode").on("click",function(){
		runsacode();
	});
		$("#resetcode").on("click",function(){
	$("#seqinput").val("");
	});
	
	//Tour Options
	var satour = new Tour();
	satour.addSteps([
	  {
		element: "#step1",
		title: "Paste Input Here",
		content: "Copy your input and paste here"
	  },
	  {
		element: "#step3",
		title: "Get your output",
		content: "Copy all content from grey area and then paste it in any text editor for example notepad++"
	  }
	]);
			// Initialize the tour
	        satour.init();
	

	
	$("#starttour").on("click",function(){
		alert("hello");
	        // Start the tour
		satour.start();
	});

});




var runsacode = function(){
var characterlength = 0;
var inptxt = $("#seqinput").val();
var sttxt = "Total Length:" + inptxt.length;
var sequences = inptxt.match(/>/g);
var nazeefa = 0;
var invalid = 0;
debughtml = "";
var maxlength = 0;
var extraspace=2;
var sequences_list = [];

for (i = 0; i < sequences.length; i++) {
    var firstg = inptxt.indexOf(">");
    var secondg = inptxt.indexOf(">", firstg + 1);
    var seqtext = inptxt.substr(firstg, secondg - firstg);
    var capstart = seqtext.search("[A-Z-*]{10}");
    //separate title
    var seqtitle = seqtext.substr(0, capstart);
    seqtitle = seqtitle.substr(1);
    if(seqtitle.length+extraspace>maxlength)
    {
        maxlength=seqtitle.length+extraspace;
    }
    // Without Spaces
    var cleanseq = seqtext.substr(capstart);
    var cleanseqwithoutspaces = cleanseq.split(" ").join("").split(" ").join("");
    //Insert in array
    sequences_list.push({
        titlelength: seqtitle.length,
        title: seqtitle,
        sequence: cleanseqwithoutspaces,
        seqlength: cleanseqwithoutspaces.length
    });
    
    inptxt = inptxt.substr(secondg);
}
$("#seqoutput").html("");
for (i = 0; i < sequences_list.length; i++) {
    var newtitle= sequences_list[i].title;
    diff_in_length=maxlength-sequences_list[i].titlelength;
    if(diff_in_length>0)
    {
        for(j=0;j<diff_in_length;j++){
            newtitle+="&nbsp;";
        }
    }
    if(sequences_list[i].seqlength>0){
        characterlength=sequences_list[i].seqlength;
		if($("#seqoutput").html()==""){
			$("#seqoutput").html(sequences_list.length-1+" "+characterlength+"<br />");
		}
        var outtxt = $("#seqoutput").html();
        $("#seqoutput").html(outtxt + newtitle + sequences_list[i].sequence + "<br />");
        nazeefa++;
    }
    
        
    
    //debug
    debughtml += "S:" + i +
        " Length (Seq:" + sequences_list[i].titlelength +
        ",CleanNoSpace:" + sequences_list[i].seqlength + ")" +
        "<br/>";
}
$("#debug").html(debughtml);
sttxt += ", Sequences:" + sequences.length;
sttxt += ", Processed:" + nazeefa + ", MaxLength:" + maxlength;
$("#stats").text(sttxt);
$("#headtext").text(sequences_list.length-1+" "+characterlength);
}
