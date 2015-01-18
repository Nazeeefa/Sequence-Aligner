$(window).load(function(){
	$("#runcode").on("click",function(){
		runsacode();
	});
		$("#resetcode").on("click",function(){
	$("#seqinput").val("");
	});

});




var runsacode = function(){
var characterlength = 0;
var inptxt = $("#seqinput").val().trim();
var inplength = inptxt.length;

var sttxt = "Total Length:" + inptxt.length;
var sequences = inptxt.match(/>/g);
var nazeefa = 0;
var invalid = 0;
debughtml = "";
var maxlength = 0;
var maxseqlength = 0;
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
    maxseqlength=cleanseqwithoutspaces.length>maxseqlength?cleanseqwithoutspaces.length:maxseqlength;
	
    inptxt = inptxt.substr(secondg);
}
//prepare SVG
var svgContainer = d3.select("#svgcontainer").append("svg").attr("width", (maxseqlength*15)+40).attr("height", (sequences_list.length*20)+40);
for(i=0;i<=maxseqlength;i++)
{
	svgContainer.append("circle").attr('data-col','c'+i).attr('data-row','rh').attr('class','r0c'+i).attr('cx',20+(i*15)).attr('cy',20).attr('fill','#ccc').attr('fill-opacity','1.0').attr('r',4);
}
//End of SVG Test
$("#seqoutput").html("");
var svgarr = [];
for (i = 0; i < sequences_list.length; i++) {
    var newtitle= sequences_list[i].title;
    diff_in_length=maxlength-sequences_list[i].titlelength;
    if(diff_in_length>0)
    {
        for(j=0;j<diff_in_length;j++){
            newtitle+="&nbsp;";
        }
    }
	//SVG Added
		svgContainer.append("circle").attr('data-col','c0').attr('data-row','r'+i+1).attr('cx',20).attr('cy',20+(i*15)).attr('r',4).attr('fill','blue');
		for(k=0;k<sequences_list[i].seqlength;k++)
		{
			var svgc= svgContainer.append("text")
			.attr('data-col','c'+(k+1))
			.attr('data-row','r'+(i+1))
			.attr('x',33+(k*15)).attr('y',40+(i*15))
			.attr('fill','green')
			.attr('style','font-size:0.6em;')
			.text(sequences_list[i].sequence[k]);
			if(sequences_list[i].sequence[k]=='-')
			{
				svgc.attr('fill','red')
				.attr('style','font-size:0.9em;');
			}
		}
	//SVG End
    if(sequences_list[i].seqlength>0){
        characterlength=sequences_list[i].seqlength;
		if($("#seqoutput").html()==""){
			$("#seqoutput").text(sequences_list.length-1+" "+characterlength);
			$("#seqoutput").html($("#seqoutput").text()+"<br />");
		}
        var outtxt = $("#seqoutput").html();
        $("#seqoutput").html(outtxt + newtitle + sequences_list[i].sequence + "<br />");
        nazeefa++;
		svgarr.push(
		{
			title:newtitle,
			seq:sequences_list[i].sequence,
			seqlength:sequences_list[i].sequence
		});
    }	
    
    //debug
    debughtml += "S:" + i +
        " Length (Seq:" + sequences_list[i].titlelength +
        ",CleanNoSpace:" + sequences_list[i].seqlength + ")" +
        "<br/>";
}
//Get colour range for 1-100;
var percentagecolour=d3.scale.linear().domain([0,50,100]).range(["green","orange","red"]);
//update column headers
for (i=0;i<maxseqlength;i++)
	{
		//for each column set to 0%
		totalhyphen=0;
		for(j=0;j<svgarr.length;j++)
		{
			if(svgarr[j].seq[i]=='-')
			{
				totalhyphen++;
			}
		}
		var percentagehyphen = Math.round((totalhyphen/svgarr.length)*100);
		$('circle.r0c'+(i+1)).attr('fill',percentagecolour(percentagehyphen)).attr('data-num',totalhyphen).attr('data-perc',percentagehyphen);
		$('circle.r0c'+(i+1)).on('click',function(){
			currentopacity = parseFloat($(this).attr('fill-opacity'));
			if(currentopacity==1.0){
				$(this).attr('fill-opacity','0.5');
				$(this).attr('stroke','black');
				$(this).attr('stroke-width','2');
			}
			else{
				$(this).attr('fill-opacity','1.0');
				$(this).attr('stroke','');
				$(this).attr('stroke-width','0');
			}
		});
		//console.log('circle.r0c'+(i+1)+": "+totalhyphen);
	}	

$("#debug").html(debughtml);
sttxt += ", Sequences:" + sequences.length;
sttxt += ", Processed:" + nazeefa + ", MaxLength:" + maxlength;
$("#stats").text(sttxt);
$("#headtext").text(sequences_list.length-1+" "+characterlength);
}

function selectText(containerid) {
    if (document.selection) {
        var range = document.body.createTextRange();
        range.moveToElementText(document.getElementById(containerid));
        range.select();
    } else if (window.getSelection()) {
        var range = document.createRange();
        range.selectNode(document.getElementById(containerid));
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
    }
}
