import Games from "../games";
const ELIMINATED_PLAYER_NAME_STYLE = "text-decoration: line-through; font-style: italic; color:grey; font-weight:bold;";

class HTMLPage{
    constructor(pageID){
        this.pageID = pageID;
    }
    createHTMLElement(element, content, style = ""){
        return "<" + element + " style='" + style + "'>" + content + "</" + element + ">";
    }
    createButton(buttonName, command, arg = '', style = ""){
        const spl = Config.rooms[0].split(",");
        return "<button type='send' value='/msg " + Config.nick + ", /msgroom " + spl[0] + ", /botmsg " + Config.nick + ", ." + command + arg + "' "+"style='" + style + "'>" + buttonName+ "</button>";
    }
    createExpandButton(){
        return this.createButton
    }
    createUsernameElement(content, style=''){
        return "<username>" + content + "</username>";
    }
    sendPage(name, pageID, html, room){
        Parse.say(room, "/msgroom, Survivor, /sendhtmlpage " + name + ", " + pageID + ", " + html);
    }
    createTextArea(rows, cols, placeholder, resize = "none", styling = "", text = ""){
        return "<textarea rows='" + rows + "' cols='" + cols + "' placeholder='" + placeholder + "' style='resize: " + resize + ";" + styling + "' name='arg'>"+text+"</textarea>";
    }
    createInlineText(text, style = ""){
        return this.createHTMLElement("span", text, style);
    }
    createHeader1(text, style = ""){
        return this.createHTMLElement("h1", text, style);
    }
    createHeader3(text, style = ""){
        return this.createHTMLElement("h3", text, style);
    }
    nestInDiv(html, style = ""){
        return this.createHTMLElement("div", html, style);
    }
    alignCenter(html, style = ""){
        return this.createHTMLElement("center", html, style);
    }
    createDynamicBorder(content){
       const innerDiv = this.nestInDiv(content, "border:solid ; margin:0 auto ;");
       return this.nestInDiv(innerDiv, "display:flex; margin-top:15px;");
    }
    createDynamicBorderWithHeader(headerText, content){
        const header = this.createHeader3(headerText, "text-align:center ; font-size:1.5em ; margin:0 ; padding:5px 0px ; border-bottom:2px solid;");
        return this.createDynamicBorder(header + content);
    }
    createSubmitFormElement(room, action, arg, content, style = ""){
        return "<form data-submitsend='/msgroom " + room + ", /botmsg " + Config.nick + ", " + action + arg + ",{arg}' style='"+ style +"'>"+ content +"</form>";
    }
    createTextInputElement(value, style = ""){
        return "<input type='text' name='arg' value='"+ value +"' style='"+ style +"' />"
    }
    createSubmitButton(label){
        return "<input type='submit' value='" + label + "'/>"
    }
    saveTextAreaContent(textAreaID){
        `<form data-submitsend="/msgroom ${room}, /botmsg ${Config.nick }, ${action} ${arg} ${user}, {arg}"><input type="text" id="${id}" name="${name}" style="${style}"> &nbsp;&nbsp;<input type="submit" value="Save"/></form>`
    }
}

class PL_Assistant_Menu extends HTMLPage{
    constructor(pageID){
        super(pageID);
    }
    createEliminationButton(playerID){
        return this.createButton("Eliminate", "elim ", playerID);
    }
    createExpandButton(playerID){
        return this.createButton("⋅⋅⋅", "plmenu expanduser,", playerID);
        //return this.createButton("⋅⋅⋅", "elim", playerName);
    }
    createRemovePlayerButton(playerID){
        return this.createButton("Remove", "plmenu remove,", playerID);
    }
    createRevivePlayerButton(playerID){
        return this.createButton("Revive", "plmenu revive,", playerID);
    }
    createButtonDivider(){
        return "<div style='border-left:2px solid; display:inline-block; height:20px; margin:-30px 5px 0; position:relative; bottom:-5px;'> </div>"
    }
    createRenamePlayerButton(playerID){
        const playerName = Games.players[playerID].name;
        const textInput =  this.createTextInputElement(playerName,"");
        const submitButton = this.createSubmitButton("Rename");
        const  content = textInput + " " +submitButton;
        return this.createSubmitFormElement("survivor", ".plmenu rename,", playerID, content, "display:inline-block;");
    }
    createTextAreaWithSave(room, action, arg, style = "", text){
        const formcontent = this.createTextArea(4, 50, "Put any hosting notes here! (Save any changes with the Save button.)", "both", "margin-bottom:5px;", text) + "<br>" + this.createToggleNotesButton("Hide") + "" + this.createSubmitButton("Save");
        return this.createSubmitFormElement(room, action, arg, formcontent, style);
    }
    createToggleNotesButton(label, style = ""){
        return this.createButton(label, "plmenu hidenotes", "", style);
    }
    createPlayerNameHTML(playerName, style){
        return this.createUsernameElement(playerName + " ", style);
    }
    createEliminatedPlayerHTML(player){
        return this.createInlineText(player.name, ELIMINATED_PLAYER_NAME_STYLE);
    }
    createCloseOpenSignupsButton(style=""){
        let statusContrary = '';
        statusContrary = Games.signupsOpen ? "Close" : "Open";
        return this.createButton("Close Signups", "ts","", style);
    }
    createSignUpTimerButton(style=''){
        return this.createButton("Signup Timer", "","", style);  
    }
    createDisplayPLButton(style=''){
        return this.createButton("Broadcast Playerlist", "pl ", "survivor", style);
    }
    //createRefreshButton(){}
    createPLHeader(){
        return this.createHeader1("PL Assistant Menu");
    }
    generatePlayerRow(player){
        const expandButton = this.createExpandButton(player.id);
        const playerNameHTML = player.eliminated ? this.createEliminatedPlayerHTML(player) : this.createPlayerNameHTML(player.name, "");
        const notesArea = this.createTextArea(1, 7, "notes", "none", "position:relative ; top:5px;");
        //const html = expandButton + playerNameHTML + notesArea;
        const html = expandButton + " " + playerNameHTML;
        return this.nestInDiv(html, "border-bottom:1px solid; padding:5px 0; margin:0 10px;");
    }
    generatePlayerRowExpanded(player){
        const expandButton = this.createExpandButton(player.id);
        const buttons = this.generateExpandedButtons(player.id);
        const playerNameHTML = player.eliminated ? this.createEliminatedPlayerHTML(player) : this.createPlayerNameHTML(player.name, "");
        //const notesArea = this.createTextArea(1, 7, "notes", "none", "position:relative ; top:5px;");
        //const html = expandButton + playerNameHTML + notesArea + "<div>" + elimButton + elimButton + "</div>";
        const html = expandButton + " " + playerNameHTML + this.nestInDiv(buttons, "margin-top:5px;");
        return this.nestInDiv(html, "border-bottom:1px solid; padding:5px 0; margin:0 10px;");
    }
    generateExpandedButtons(playerID){
        let html = "";
        const divider = this.createButtonDivider();
        if (!Games.players[playerID].eliminated){
            const elimButton = this.createEliminationButton(playerID);
            const renameButton = this.createRenamePlayerButton(playerID);
            html = elimButton + divider + renameButton;
        }
        else{
            const removeButton = this.createRemovePlayerButton(playerID);
            const reviveButton = this.createRevivePlayerButton(playerID);
            html = removeButton + divider + reviveButton;
        }
        return html;
    }
    generateOptionsRow(...buttons){
        let html = "";
            for (const arg of buttons) {
              html += arg;
            }
        return this.nestInDiv(html, "");
    }
    generateAllPlayerRows(players){
        let html = "";
        for (const arg of Object.keys(players)) {
            console.log(Games.expandedUser);
            if(players[arg].eliminated) continue;
            if(Games.expandedUser === players[arg].id) { html += this.generatePlayerRowExpanded(players[arg]); continue; }
            html += this.generatePlayerRow(players[arg]);
        }
        for (const arg of Object.keys(players)) {
            console.log(Games.expandedUser);
            if(!players[arg].eliminated) continue;
            if(Games.expandedUser === players[arg].id) { html += this.generatePlayerRowExpanded(players[arg]); continue; }
            html += this.generatePlayerRow(players[arg]);
        }
        return this.nestInDiv(html, "");
    }
    generateElimPlayerRows(players){
        let html = "";
        for (const arg of Object.keys(players)) {
            console.log(Games.expandedUser);
            if(!players[arg].eliminated) continue;
            if(Games.expandedUser === players[arg].id) { html += this.generatePlayerRowExpanded(players[arg]); continue; }
            html += this.generatePlayerRow(players[arg]);
        }
        return this.nestInDiv(html, "");
    }

    generateAlivePlayers(players){
        return this.createDynamicBorderWithHeader("Players", this.generateAllPlayerRows(players));
    }
    generatePLHeading(){
        let notesArea = '';
        let optionsRow = '';
        const PLHeader = this.createPLHeader();
        const displayPLButton = this.createDisplayPLButton("margin-right:5px;");
        const closeSignUpsButton = this.createCloseOpenSignupsButton("margin-right:5px;");
        const signUpTimerButton = this.createSignUpTimerButton();
        optionsRow = this.generateOptionsRow(displayPLButton, closeSignUpsButton, signUpTimerButton);
        if (!Games.hideNotes) { 
            notesArea = this.createTextAreaWithSave("survivor", ".plmenu ", "savenotes", "margin-top:10px;", Games.notes);
        } else {
            const showNotesButton = this.createToggleNotesButton("Show Notes", "margin-top:5px;");
            optionsRow += this.generateOptionsRow(showNotesButton);
        }

        return this.createHTMLElement('div', PLHeader + optionsRow + notesArea, "width:50% ; margin:0 auto ; text-align:center;")
    }
    generatePLAssistantHTML(){
        const PLHeading = this.generatePLHeading();
        const playerRowsHTML = this.generateAlivePlayers(Games.players);

        return PLHeading + playerRowsHTML;
    }
}

let PL_Menu = new PL_Assistant_Menu("PLAssistantMenu");
module.exports = PL_Menu;



