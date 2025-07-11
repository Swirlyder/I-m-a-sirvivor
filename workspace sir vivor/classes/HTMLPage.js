//import Games from "../games";

const PLAYERLIST_MENU_TITLE = "Player List Menu";

class HTMLPage {
    constructor(pageID) {
        this.pageID = pageID;
    }
    createHTMLElement(element, content, style = "") {
        return "<" + element + " style='" + style + "'>" + content + "</" + element + ">";
    }
    createButton(buttonName, command, arg = '', style = "") {
        const spl = Config.rooms[0].split(",");
        return "<button class='button' type='send' value='/msg " + Config.nick + ", /msgroom " + spl[0] + ", /botmsg " +
            Config.nick + ", ." + command + arg + "' " + "style='" + style + "'>" + buttonName + "</button>";
    }
    createExpandButton() {
        return this.createButton
    }
    createUsernameElement(content, style = '') {
        return "<username>" + content + "</username>";
    }
    sendPage(name, pageID, html, room) {
        Parse.say(room, "/msgroom, Survivor, /sendhtmlpage " + name + ", " + pageID + ", " + html);
    }
    createTextArea(rows, cols, placeholder, resize = "none", styling = "", text = "") {
        return "<textarea rows='" + rows + "' cols='" + cols + "' placeholder='" + placeholder +
            "' style='resize: " + resize + ";" + styling + "' name='arg'>" + text + "</textarea>";
    }
    createInlineText(text, style = "") {
        return this.createHTMLElement("span", text, style);
    }
    createHeader1(text, style = "") {
        return this.createHTMLElement("h1", text, style);
    }
    createHeader3(text, style = "") {
        return this.createHTMLElement("h3", text, style);
    }
    nestInDiv(html, style = "") {
        return this.createHTMLElement("div", html, style);
    }
    alignCenter(html, style = "") {
        return this.createHTMLElement("center", html, style);
    }
    createDynamicBorder(content) {
        const innerDiv = this.nestInDiv(content, "border:solid ; margin:0 auto ;");
        return this.nestInDiv(innerDiv, "display:flex; margin-top:15px;");
    }
    createDynamicBorderWithHeader(headerText, content) {
        const style = "text-align:center ; font-size:1.5em ; margin:0 ; padding:5px 0px ; border-bottom:2px solid;";
        const header = this.createHeader3(headerText, style);
        return this.createDynamicBorder(header + content);
    }
    createSubmitFormElement(room, action, arg, content, style = "") {
        return "<form data-submitsend='/msgroom " + room + ", /botmsg " + Config.nick + ", " + action + arg + ",{arg}' style='" + style + "'>" + content + "</form>";
    }
    createTextInputElement(value, style = "") {
        return "<input type='text' name='arg' value='" + value + "' style='" + style + "' />"
    }
    createSubmitButton(label) {
        return "<input type='submit' value='" + label + "'/>"
    }
    htmlTableWrapper(content, style = '') {
        return "<table border=1 style='" + style + "'>" + content + "</table>";
    }
    htmlTableHeaderWrapper(content, style = '') {
        return this.createHTMLElement("th", content, style = "");
    }
    htmlTableDataWrapper(content, style = '') {
        return this.createHTMLElement("td", content, style = "");
    }
    htmlTableRowWrapper(content, style = '') {
        return this.createHTMLElement("tr", content, style = "");
    }
}

class PL_Assistant_Menu extends HTMLPage {
    constructor(pageID) {
        super(pageID);
    }
    createEliminationButton(playerID) {
        return this.createButton("Eliminate", "plmenu elim,", playerID);
    }
    createExpandButton(playerID) {
        return this.createButton("⋅⋅⋅", "plmenu expanduser,", playerID);
    }
    createRemovePlayerButton(playerID) {
        return this.createButton("Remove", "plmenu remove,", playerID);
    }
    createRevivePlayerButton(playerID) {
        return this.createButton("Revive", "plmenu revive,", playerID);
    }
    createButtonDivider() {
        let style = "<div style='border-left:2px solid; display:inline-block; height:20px; ";
        style += "margin:-30px 5px 0; position:relative; bottom:-5px;'></div>";
        return style;
    }
    createRefreshButton(command, arg = '', style = '') {
        return this.createButton("Refresh", "plmenu", arg, style);
    }
    createExitButton(command, arg = '', style = '') {
        return this.createButton("Exit", "plmenu exit", arg, style);
    }
    //TODO: pass Games.players[playerID].name as argument
    createRenamePlayerButton(playerID) {
        const playerName = Games.players[playerID].name;
        const textInput = this.createTextInputElement(playerName, "");
        const submitButton = this.createSubmitButton("Rename");
        const content = textInput + " " + submitButton;
        return this.createSubmitFormElement("survivor", ".plmenu rename,", playerID, content, "display:inline-block;");
    }
    createTextAreaWithSave(room, action, arg, style = "", text) {
        const placeholder = "Put any hosting notes here! (Save any changes with the Save button.)"
        let formcontent = this.createTextArea(4, 50, placeholder, "both", "margin-bottom:5px;", text);
        formcontent += "<br>" + this.createToggleNotesButton("Hide") + "" + this.createSubmitButton("Save");
        return this.createSubmitFormElement(room, action, arg, formcontent, style);
    }
    createToggleNotesButton(label, style = "") {
        return this.createButton(label, "plmenu hidenotes", "", style);
    }
    createPlayerNameHTML(playerName, style) {
        return this.createUsernameElement(playerName + " ", style);
    }
    createEliminatedPlayerHTML(player) {
        const style = "text-decoration: line-through; font-style: italic; color:grey; font-weight:bold;"
        return this.createInlineText(player.name, style);
    }
    //TODO: pass Games.signupsOpen as argument
    createCloseOpenSignupsButton(style = "") {
        let statusContrary = '';
        statusContrary = Games.signupsOpen ? "Close" : "Open";
        return this.createButton(statusContrary + " Signups", "plmenu ts", "", style);
    }
    createSignUpTimerSection() {
        const option1 = this.createSignupTimerButton("1");
        const option2 = this.createSignupTimerButton("3");
        const option3 = this.createSignupTimerButton("5");
        const html = "Signup Timer: " + option1 + " " + option2 + " " + option3;
        const temp = this.nestInDiv(html, "border:1px solid ; border-radius:4px ; margin:0 auto ; font-size:.8em ; padding:1px 5px ; font-family:sans-serif;")
        return this.nestInDiv(temp, "display:flex; margin-top:5px;");
    }
    createSignupTimerButton(minutes, style = '') {
        return this.createButton(minutes, "plmenu timer, ", minutes, style);
    }
    createDisplayPLButton(style = '') {
        return this.createButton("Broadcast Playerlist", "pl ", "survivor", style);
    }
    createPLHeader() {
        return this.createHeader3(PLAYERLIST_MENU_TITLE);
    }
    createEndSignupsTimerButton() {
        return this.createButton("End Signups Timer", "plmenu timer,", " end", "");
    }
    generatePlayerRow(player) {
        const expandButton = this.createExpandButton(player.id);
        const playerNameHTML = player.eliminated ? this.createEliminatedPlayerHTML(player) : this.createPlayerNameHTML(player.name, "");
        const html = expandButton + " " + playerNameHTML;
        return this.nestInDiv(html, "border-bottom:1px solid; padding:5px 0; margin:0 10px;");
    }
    generatePlayerRowExpanded(player) {
        const expandButton = this.createExpandButton(player.id);
        const buttons = this.generateExpandedButtons(player.id);
        const playerNameHTML = player.eliminated ? this.createEliminatedPlayerHTML(player) : this.createPlayerNameHTML(player.name, "");
        const html = expandButton + " " + playerNameHTML + this.nestInDiv(buttons, "margin-top:5px;");
        return this.nestInDiv(html, "border-bottom:1px solid; padding:5px 0; margin:0 10px;");
    }
    getExpandedButtonsAlive(playerID) {
        const divider = this.createButtonDivider();
        const elimButton = this.createEliminationButton(playerID);
        const renameButton = this.createRenamePlayerButton(playerID);
        return elimButton + divider + renameButton;
    }
    getExpandedButtonsElim(playerID) {
        const divider = this.createButtonDivider();
        const removeButton = this.createRemovePlayerButton(playerID);
        const reviveButton = this.createRevivePlayerButton(playerID);
        return removeButton + divider + reviveButton;
    }
    //TODO: pass Games.players[playerID].eliminated as argument
    generateExpandedButtons(playerID) {
        return !Games.players[playerID].eliminated ? this.getExpandedButtonsAlive(playerID) : this.getExpandedButtonsElim(playerID);
    }
    generateOptionsRow(...buttons) {
        const html = buttons.join("");
        return this.nestInDiv(html, "margin-top:10px;");
    }
    //TODO: pass Games.expandedUser as argument
    generateAllPlayerRows(players) {
        let elimPlayers = '';
        let alivePlayers = '';
        let rowHTML = '';
        for (const arg of Object.keys(players)) {
            rowHTML = Games.expandedUser === players[arg].id ? this.generatePlayerRowExpanded(players[arg]) : this.generatePlayerRow(players[arg]);
            if (players[arg].eliminated == true) {
                elimPlayers += rowHTML;
            } else {
                alivePlayers += rowHTML;
            }
        }
        const html = alivePlayers + elimPlayers;
        return this.nestInDiv(html, "");
    }
    generatePlayerListSection(players) {
        return this.createDynamicBorderWithHeader("Players", this.generateAllPlayerRows(players));
    }
    generateTitleBar() {
        const title = this.createHeader1(PLAYERLIST_MENU_TITLE, "display:inline-block; position:relative; top:4px; margin:5px;");
        const refreshButton = this.createRefreshButton("test");
        const exitButton = this.createExitButton("test");
        return this.nestInDiv(refreshButton + title + exitButton, "border-bottom:solid; margin-bottom:5px;");
    }
    //TODO: pass Games.isSignupTimer, Games.hideNotes, Games.notes, as argument, 
    generatePLHeading() {
        const titleBar = this.generateTitleBar();
        const displayPLButton = this.createDisplayPLButton("margin-right:5px;");
        const closeSignUpsButton = this.createCloseOpenSignupsButton("margin-right:5px;");
        const signUpTimerButton = Games.isSignupTimer ? this.createEndSignupsTimerButton() : this.createSignUpTimerSection();
        let optionsRow = this.generateOptionsRow(displayPLButton, closeSignUpsButton, signUpTimerButton);

        return this.createHTMLElement('div', titleBar + optionsRow, "width:70% ; margin:0 auto ; text-align:center;")
    }
    //TODO: pass Games.players as argument
    generatePLAssistantHTML() {
        const PLHeading = this.generatePLHeading();
        const playerRowsHTML = this.generatePlayerListSection(Games.players);

        return PLHeading + playerRowsHTML;
    }
}

class ThemesDB extends HTMLPage {
    constructor(pageID) {
        super(pageID);
    }
    generateHTML(themes) {
        const tdStyle = "font-weight:normal;"
        const tableStyle = "font-size:.85em; text-align:center;";
        let dataHTML = ""
        let rowHTML = "";
        let headingHTML = "";
        let html = "";
        const headers = ["ID", "Name", "Aliases", "Difficulty", "Description", "URL"];
        for (const header of headers) {
            headingHTML += this.htmlTableHeaderWrapper(header);
        }
        html += this.htmlTableRowWrapper(headingHTML);

        for (const theme of themes) {

            const data = [
                theme.id,
                theme.name,
                theme.aliases.join(", "), // Join aliases into a single string
                theme.difficulty || "",   // In case difficulty is optional
                theme.desc,
                theme.url
            ];

            for (const element of data) {
                
                dataHTML += this.htmlTableDataWrapper(element, tdStyle);
            }
            rowHTML += this.htmlTableRowWrapper(dataHTML);
            dataHTML = "";
        }

        html += rowHTML;
        html = this.htmlTableWrapper(html, tableStyle);
        return html;
    }
}

let PL_Menu = new PL_Assistant_Menu("PLAssistantMenu");
module.exports = { PL_Menu, ThemesDB };



