'use strict'
//==========================================================================================================================//
//     _    ___                 ______            __             ____         
//    | |  / (_)__ _      __   / ____/___  ____  / /__________  / / /__  _____
//    | | / / / _ \ | /| / /  / /   / __ \/ __ \/ __/ ___/ __ \/ / / _ \/ ___/     
//    | |/ / /  __/ |/ |/ /  / /___/ /_/ / / / / /_/ /  / /_/ / / /  __/ /         
//    |___/_/\___/|__/|__/   \____/\____/_/ /_/\__/_/   \____/_/_/\___/_/                                                                           
//
//==========================================================================================================================//
// Manages game views.
//==========================================================================================================================//
class ViewController {
    
    /**
     * Creates a new ViewController.
     * @param parent the css selector for the parent element that the game will be displayed in
     */
    constructor(parent) {
        log.info('View Controller Created', arguments)
        this.live = [];
        this.last = null;
        this.parent = $( parent );
        this.reload = function() {};
        
        log.debug('Currently booting straight to the main menu');
        // this.login(); // Uncomment this line and remove the following to load normally
        this.mainMenu(new PlayerModel('debug'));
    }
    
    /**
     * Adds a component to the list components ready to update.
     * @param comopnent the component to add
     */
    add(component) {
        this.live.push(component);
        this.last = component;
    }
    
    /**
     * Clears the aprent element.
     */
    clear() {
        this.parent.html( '' );
    }
    
    /**
     * Updates all components ready to display.
     */
    update() {
        for(var i = 0; i < this.live.length; i++)
            this.live[i].render(this.parent);
        for(var i = 0; i < this.live.length; i++)
            this.live[i].ready();
        this.live = [];
    }
    
    /**
     * Send a temporary message to the screen.
     * @param message  the text of the message
     * @param color    the background color of the message
     * @param callback a function to run upon the completion of the message
     */
    message(message, color=background1, callback=function(){}) {
        log.info('sent message', arguments);
        // Remove after second animation
        var ready = false;
        var removeAction = new Action().trigger('animationend').action(function(component) {
            if (component.visited != undefined) {
                $.when( component.$.remove() ).then( function() {
                    if (ready) 
                        callback();
                    else 
                        ready = true;
                });
            }
            component.visited = true;                                                
        });
        this.add( ComponentFactory.Vector().poly([40,0, 60,0, 60,50, 40,50], color).z('60').addClass('banner-transition').skew('-55deg').addAction(removeAction) );
        this.add( ComponentFactory.Title().text(message).width(100).yz(22, 61).addClass('text-transition').addAction(removeAction).size(5) );
        this.update();
    }
    
    /**
     * Load the login screen.
     */
    login() {
        log.info('loaded login');
        // Reload function
        this.reload = function() {
            this.login();
        }
        // Actions
        var newAccountAction = ComponentFactory.ClickAction(function() { newAccount($('.username').val().toLowerCase(), $('.password').val().toLowerCase()); });
        var loginAction = ComponentFactory.ClickAction(function() { login($('.username').val().toLowerCase(), $('.password').val().toLowerCase()); });
        // Vectors
        this.add( ComponentFactory.Vector()
                 .poly([50,0, 70,0, 20,20], accent)
                 .poly([7,0,  50,0, 0,45, 0,35], background1)
                 .addClass('slide-down') );
        this.add( ComponentFactory.Vector()
                 .poly([35,50, 80,40,  80,50], accent)
                 .poly([50,50, 100,25, 100,50], background1)
                 .addClass('slide-up') );
        // Username/pass entry
        this.add( ComponentFactory.Title('USERNAME').xy(16, 20) );
        this.add( ComponentFactory.Title('PASSWORD').xy(15, 26) );
        this.add( ComponentFactory.Input().xy(32, 20).addClass('username').addAction(ComponentFactory.FocusAction()) );
        this.add( ComponentFactory.Password().xy(31, 26).addClass('password') );
        // Buttons
        this.add( ComponentFactory.TitleButton('NEW ACCOUNT', select1, select1).xyz(43, 31, 51).addAction(newAccountAction) );
        this.add( ComponentFactory.TitleButton('LOGIN', select2, select2).xy(63, 31).addAction(loginAction) );
        // Images
        this.add( ComponentFactory.Resource('/rsc/icons/logo.png').xy(20, -5).width(28).addClass('slide-down') );
        // Render
        this.clear();
        this.update();
    }
    
    /**
     * Load the main menu.
     * @param playerModel the PlayerModel used for states
     */
    mainMenu(playerModel) {
        log.info('loaded mainMenu', arguments);
        // Reload function
        this.reload = function() {
            this.mainMenu(playerModel);
        }
        var vc = this;
        // Actions
        var toStory   = ComponentFactory.ClickAction(function() { vc.levelSelect(playerModel) });
        var toVersus  = ComponentFactory.ClickAction(function() { vc.pvpAi(playerModel) });
        var toReplay  = ComponentFactory.ClickAction(function() { vc.replayList(playerModel) });
        var toProfile = ComponentFactory.ClickAction(function() { vc.profile(playerModel) });
        var toLogin   = ComponentFactory.ClickAction(function() { vc.login(); });
        // Vectors
        this.add( ComponentFactory.Vector()
                 .poly([0,0, 12,0, 17,30, 0,30], accent)
                 .poly([0,0, 3,0,  35,50, 0,50], background1)
                 .addClass('slide-right') );
        this.add( ComponentFactory.Vector()
                 .poly([68,9, 94,8,  94,14], accent)
                 .poly([65,8, 97,14, 97,20, 60,25], background1)
                 .circle(85.5, 14, 3, '#444')
                 .circle(86, 14.5, 2.5, background1)
                 .addClass('slide-left') );
		// Text
        this.add( ComponentFactory.Text('PLAYING AS').xy(72, 8.5).addClass('slide-left') );
        this.add( ComponentFactory.Text(playerModel.username(), select1).xy(83, 8.5).addClass('slide-left').weight('bold') );
        this.add( ComponentFactory.Text('RANK', '#444').xy(84, 14).size(5).addClass('slide-left') );
        this.add( ComponentFactory.Text(playerModel.rank(), select2).size(4).xy(80, 16).width(16).addClass('slide-left') );   
        this.add( ComponentFactory.Text('W/L'     ).xy(66,   12  ).size(2).addClass('slide-left') );
        this.add( ComponentFactory.Text('K/D'     ).xy(65.5, 14.5).size(2).addClass('slide-left') );
        this.add( ComponentFactory.Text('TIME'    ).xy(65,   17  ).size(2).addClass('slide-left') );
        this.add( ComponentFactory.Text('PROGRESS').xy(64.5, 19.5).size(2).addClass('slide-left') );
        this.add( ComponentFactory.Text(playerModel.winLoss(), select1  ).xy(73.5, 12  ).size(2).addClass('slide-left') );
        this.add( ComponentFactory.Text(playerModel.killDeath(), select1).xy(73,   14.5).size(2).addClass('slide-left') );
        this.add( ComponentFactory.Text(playerModel.playtime(), select1 ).xy(72.5, 17  ).size(2).addClass('slide-left') );
        this.add( ComponentFactory.Text(playerModel.progress(), select1 ).xy(72,   19.5).size(2).addClass('slide-left') );
        // Buttons
        this.add( ComponentFactory.TitleButton('STORY'  ).xy(6, 10).addAction(toStory).addClass('slide-up') );
        this.add( ComponentFactory.TitleButton('VERSUS' ).xy(9, 15).addAction(toVersus).addClass('slide-up') );
        this.add( ComponentFactory.TitleButton('REPLAY' ).xy(12, 20).addAction(toReplay).addClass('slide-up') );
        this.add( ComponentFactory.TitleButton('PROFILE').xy(15, 25).addAction(toProfile).addClass('slide-up') );
        this.add( ComponentFactory.TitleButton('LOGOUT' ).xy(18, 30).addAction(toLogin).addClass('slide-up') );
        // Images
        this.add(ComponentFactory.Background('mainmenu').xy(20, 15).width(70).addClass('slide-up') );
        // Render
        this.clear();
        this.update();
    }
 
    /**
     * Load the level select screen.
     * @param playerModel the PlayerModel used for states
     */
    levelSelect(playerModel) {
        log.info('loaded levelSelect', arguments);
        // Reload function
        this.reload = function() {
            this.levelSelect(playerModel);
        }
        var vc = this;
        // Actions
        var levelI   = ComponentFactory.ClickAction(function() { vc.story(playerModel, 0, 0)});
        var levelII  = ComponentFactory.ClickAction(function() { vc.story(playerModel, 1, 0)});
        var levelIII = ComponentFactory.ClickAction(function() { vc.story(playerModel, 2, 0)});
        var levelIV  = ComponentFactory.ClickAction(function() { vc.story(playerModel, 3, 0)});
        var levelV   = ComponentFactory.ClickAction(function() { vc.story(playerModel, 4, 0)});
        var menu     = ComponentFactory.ClickAction(function() { vc.mainMenu(playerModel); });
        // Vectors
        this.add( new Component().width(100).height(50).background(accent) );
        // Black backgrounds
        this.add( ComponentFactory.Vector()
                 .poly([0,50,  10,0,  20,0,  10,50], background1)
                 .poly([20,50, 30,0,  40,0,  30,50], background1)
                 .poly([40,50, 50,0,  60,0,  50,50], background1)
                 .poly([60,50, 70,0,  80,0,  70,50], background1)
                 .poly([80,50, 90,0,  100,0, 90,50], background1)
                 .z(1).addClass('slide-left') );
        // White backgrounds and characters
        this.add( ComponentFactory.Character('level1').xyz(3, 7, 2).width(18).addClass('slide-up') ); 
        var white = ComponentFactory.Vector()
                 .poly([0,50,  5,25,    14.6,27, 10,50], background2)
                 .poly([0,25,  10,50,   0,50], background1)
                 .z(3).addClass('slide-up');
        if (playerModel.levels() > 0) {  
            white.poly([20,50, 24.2,29, 33.8,31, 30,50], background2)
            this.add( ComponentFactory.Character('level2').xyz(21.5, 7, 2).width(18).addClass('slide-up') );
            this.add( ComponentFactory.TitleButton('REPLAY').xy(4, 1).addClass('slide-left').addAction(levelI) );
        } else if (playerModel.levels() == 0) {
            this.add( ComponentFactory.TitleButton('CONTINUE').xy(4, 1).addClass('slide-left').addAction(levelI) );
        }
        if (playerModel.levels() > 1) {
            white.poly([40,50, 43.4,33, 53.0,35, 50,50], background2)
            this.add( ComponentFactory.Character('level3').xyz(40, 14, 2).width(18).addClass('slide-up') );
            this.add( ComponentFactory.TitleButton('REPLAY').xy(24, 1).addClass('slide-left').addAction(levelII) );
        } else if (playerModel.levels() == 1) {
            this.add( ComponentFactory.TitleButton('CONTINUE').xy(24, 1).addClass('slide-left').addAction(levelII) );
        }
        if (playerModel.levels() > 2) {
            white.poly([60,50, 62.6,37, 72.2,39, 70,50], background2)
            this.add( ComponentFactory.Character('level4').xyz(61.5, 16, 2).width(18).addClass('slide-up') );
            this.add( ComponentFactory.TitleButton('REPLAY').xy(44, 1).addClass('slide-left').addAction(levelIII) );   
        } else if (playerModel.levels() == 2) {
            this.add( ComponentFactory.TitleButton('CONTINUE').xy(44, 1).addClass('slide-left').addAction(levelIII) );
        }
        if (playerModel.levels() > 3) { 
            white.poly([80,50, 81.8,41, 91.4,43, 90,50], background2)
            this.add( ComponentFactory.Character('level5').xyz(76, 19, 2).width(18).addClass('slide-up') );
            this.add( ComponentFactory.TitleButton('REPLAY').xy(64, 1).addClass('slide-left').addAction(levelIV) );
        } else if (playerModel.levels() == 3) {
            this.add( ComponentFactory.TitleButton('CONTINUE').xy(64, 1).addClass('slide-left').addAction(levelIV) );
        }
        if (playerModel.levels() > 4) { 
            this.add( ComponentFactory.TitleButton('REPLAY').xy(84, 1).addClass('slide-left').addAction(levelV) );
        } else if (playerModel.levels() == 4) {
            this.add( ComponentFactory.TitleButton('CONTINUE').xy(84, 1).addClass('slide-left').addAction(levelV) );
        }
        this.add( white );
        // Levels
        this.add( ComponentFactory.Text('I',   background1).xy(8,    26).size(8).style('normal').rotate('11.3deg').addClass('slide-up-rotated') );
        this.add( ComponentFactory.Text('II',  background1).xy(26.5, 30).size(8).style('normal').rotate('11.3deg').addClass('slide-up-rotated') );
        this.add( ComponentFactory.Text('III', background1).xy(45,   34).size(8).style('normal').rotate('11.3deg').addClass('slide-up-rotated') );
        this.add( ComponentFactory.Text('IV',  background1).xy(64,   38).size(8).style('normal').rotate('11.3deg').addClass('slide-up-rotated') );
        this.add( ComponentFactory.Text('V',   background1).xy(84,   42).size(8).style('normal').rotate('11.3deg').addClass('slide-up-rotated') );
        // Buttons
        this.add( ComponentFactory.TitleButton('RETURN').xy(1, 40).addClass('slide-right').addAction(menu) );
        // Render
        this.clear();
        this.update();
    }
    
    /**
     * Load a story screen.
     * @param playerModel the PlayerModel used for states
     * @param level       the story level to load
     * @param scene       the level scene to load
     */
    story(playerModel, level, scene) {
        log.info('loaded story', arguments);
        // Reload function
        this.reload = function() {
            this.story(playerModel, level, scene);
        }
        var vc = this;
        // Actions
        var skip = ComponentFactory.ClickAction(function() { new GameController(
            vc, 
            playerModel, 
            story[level].game.size, 
            story[level].game.ai, 
            function(){ vc.levelSelect(playerModel); },
            undefined,
            story[level].game.color,
            story[level].game.background
        )});
        if (story[level].scenes.length <= scene) {
            skip.action()();
            return;
        }
        var next = ComponentFactory.ClickAction(function () {
            vc.story(playerModel, level, scene + 1);    
        });
        var data  = story[level].scenes[scene];
        var quit  = ComponentFactory.ClickAction(function() { vc.levelSelect(playerModel); });
        var typed = new Action().trigger('ready').action(function(component) {
            component.$.typed({
                strings: [data.text],
                typeSpeed: 0
            }); 
        }); 
        // Vectors
        vc.add( ComponentFactory.Vector().poly([0,25, 10,0, 0,0], background1).z(1).addClass('slide-right') );
        vc.add( ComponentFactory.Vector()
            .poly([40,38, 87,35, 88,47], data.color)
            .poly([8,47, 12,34, 90,41, 90,47], background1)
            .z(1).addClass('slide-up') );
        // Images
        if (data.background)
            this.add( ComponentFactory.Background(data.background) );
        if (data.character)
            this.add( ComponentFactory.Character(data.character).xy(65, 9).width(25).addClass('slide-up') );
        // Text
        this.add( ComponentFactory.Text(data.name).size(4).xy(70, 35.5).width(18).addClass('slide-up') ); 
        this.add( ComponentFactory.Text().element('pre').size(2).family('sans-serif').xy(13, 39).addClass('slide-up').addAction(typed) );
        // Buttons
        this.add( ComponentFactory.TitleButton('QUIT').xy(3, 5).addClass('slide-right').addAction(quit) );
        this.add( ComponentFactory.TitleButton('NEXT').xy(72, 44.5).addClass('slide-up').addAction(next) );
        this.add( ComponentFactory.TitleButton('SKIP').xy(80, 44.5).addClass('slide-up').addAction(skip) );
        // Render
        this.clear();
        this.update();
    }
    
    /**
     * Load the pvp/ai selection screen.
     * @param playerModel the PlayerModel used for states
     */
    pvpAi(playerModel) {
        log.info('loaded pvpAi', arguments);
        // Reload function
        this.reload = function() {
            this.pvpAi(playerModel);
        }
        var vc = this;
        // Actions
        var menu      = ComponentFactory.ClickAction(function() { vc.mainMenu(playerModel) });
        var versusAi  = ComponentFactory.ClickAction(function() { vc.versusAi(playerModel) });
        var versusPvP = ComponentFactory.ClickAction(function() { vc.versusPvP(playerModel) });
        // Vectors
        this.add( ComponentFactory.Vector().poly([0,0,  55,0,  45,50,  0,50], background1).addClass('slide-right') );
        this.add( ComponentFactory.Vector().poly([55,0, 100,0, 100,50, 45,50], accent).addClass('slide-left') );
        // Buttons
        this.add( ComponentFactory.TitleButton('RETURN').xy(1,  40).addClass('slide-right').addAction(menu) );
        this.add( ComponentFactory.LargeTitleButton('PVP').xy(20, 4 ).addClass('slide-right').addAction(versusPvP) );
        this.add( ComponentFactory.LargeTitleButton('AI' ).xy(70, 37).addClass('slide-left').addAction(versusAi) );
        //Images
        this.add( ComponentFactory.Character('pvp').xy(5,  10).width(30).addClass('slide-right') );
        this.add( ComponentFactory.Character('ai' ).xy(55, 10).width(30).addClass('slide-left') );
        // Render
        this.clear();
        this.update();
    }
    
    /**
     * Load the verus pvp screen.
     * @param playerModel the PlayerModel used for states
     */
    versusPvP(playerModel) {
        log.info('loaded versusPvP', arguments);
        // Reload function
        this.reload = function() {
            this.versusPvP(playerModel);
        }
        var vc = this;
        var background = '1';
        // Actions
        var menu  = ComponentFactory.ClickAction(function() { vc.mainMenu(playerModel); });
        var play  = ComponentFactory.ClickAction(function() { 
            new GameController(vc, playerModel, 9, null, function(){ vc.versusPvP(playerModel); }, function() {}, accent, background); 
        });
        var stageSelect = ComponentFactory.ClickAction(function(component) {
            background = component.recieve();
            $( '.stage' ).addClass('unselected');
            component.$.removeClass('unselected')
        });
        // Vectors
        this.add( ComponentFactory.Vector()
            .poly([0,5, 0,50, 7,50], accent)
            .poly([32,0, 76,0, 66,50, 22,50], background1)
            .poly([0,25,  10,50,   0,50], background1)
            .addClass('slide-right') );
        // Selections
        this.add( ComponentFactory.SelectStage('select1', 1).xy(17, 13).addAction(stageSelect).removeClass('unselected') );
        this.add( ComponentFactory.SelectStage('select2', 2).xy(29, 13).addAction(stageSelect) );
        this.add( ComponentFactory.SelectStage('select3', 3).xy(41, 13).addAction(stageSelect) );
        this.add( ComponentFactory.SelectStage('select4', 4).xy(53, 13).addAction(stageSelect) );
        this.add( ComponentFactory.SelectStage('select5', 5).xy(65, 13).addAction(stageSelect) );
        // Buttons
        this.add( ComponentFactory.LargeTitleButton('PlAY', background1).xy(80, 19).style('normal').addClass('slide-right').addAction(play) );
        this.add( ComponentFactory.TitleButton('RETURN').xy(1,  40).addClass('slide-right').addAction(menu) );
        // Render
        this.clear();
        this.update();
    }
    
    /**
     * Load the versus ai screen.
     * @param playerModel the PlayerModel used for states
     */
    versusAi(playerModel) {
        log.info('loaded versusAi', arguments);
        // Reload function
        this.reload = function() {
            this.versusAi(playerModel);
        }
        var vc = this;
        var background = '1';
        // Actions
        var menu   = ComponentFactory.ClickAction(function() { vc.mainMenu(playerModel); });
        var play   = ComponentFactory.ClickAction(function() { 
            new GameController(vc, playerModel, 9, 'AI2', function(){ vc.versusAi(playerModel); }, function() {}, accent, background); 
        });
        var aiSelect = ComponentFactory.ClickAction(function(component) {
            $( '.ai' ).addClass('unselected');
            component.$.removeClass('unselected')
        });
        var stageSelect = ComponentFactory.ClickAction(function(component) {
            background = component.recieve();
            $( '.stage' ).addClass('unselected');
            component.$.removeClass('unselected')
        });
        // Vectors
        this.add( ComponentFactory.Vector()
            .poly([0,5, 0,50, 7,50], accent)
            .poly([32,0, 76,0, 66,50, 22,50], background1)
            .poly([0,25,  10,50,   0,50], background1)
            .addClass('slide-right') );
        // Selections
        this.add( ComponentFactory.SelectAi('select1', 1).xy(20, 2).addAction(aiSelect).removeClass('unselected') );
        this.add( ComponentFactory.SelectAi('select2', 2).xy(32, 2).addAction(aiSelect) );
        this.add( ComponentFactory.SelectAi('select3', 3).xy(44, 2).addAction(aiSelect) );
        this.add( ComponentFactory.SelectAi('select4', 4).xy(56, 2).addAction(aiSelect) );
        this.add( ComponentFactory.SelectAi('select5', 5).xy(68, 2).addAction(aiSelect) );
        this.add( ComponentFactory.SelectStage('select1', 1).xy(20, 26).addAction(stageSelect).removeClass('unselected') );
        this.add( ComponentFactory.SelectStage('select2', 2).xy(32, 26).addAction(stageSelect) );
        this.add( ComponentFactory.SelectStage('select3', 3).xy(44, 26).addAction(stageSelect) );
        this.add( ComponentFactory.SelectStage('select4', 4).xy(56, 26).addAction(stageSelect) );
        this.add( ComponentFactory.SelectStage('select5', 5).xy(68, 26).addAction(stageSelect) );   
        // Buttons
        this.add( ComponentFactory.LargeTitleButton('PlAY', background1).xy(80, 19).style('normal').addClass('slide-right').addAction(play) );
        this.add( ComponentFactory.TitleButton('RETURN').xy(1,  40).addClass('slide-right').addAction(menu) );
        // Render
        this.clear();
        this.update();
    }
    
    /**
     * Load the replay list screen.
     * @param playerModel the PlayerModel used for states
     */
    replayList(playerModel) {
        log.info('loaded replayList', arguments);
        // Reload function
        this.reload = function() {
            this.replayList(playerModel);
        }
        // Actions
        var menu  = ComponentFactory.ClickAction(function() { vc.mainMenu(playerModel); });
        // Vectors
        this.add( ComponentFactory.Vector().poly([0,0,     50,0,  35,50,  0,50], background1).z(1).addClass('slide-right') );
        this.add( ComponentFactory.Vector().poly([100,50,  100,25,  90,50], background1).z(2).addClass('slide-left') );
        // Background
        this.add( ComponentFactory.Background('2') );
        this.add( ComponentFactory.Title('VS').size(10).xy(70, 10) );
        // List
        this.add( ComponentFactory.List()
                 .addComponent( ComponentFactory.Text('TESTING').element('li').position('relative') )
                 .addComponent( ComponentFactory.Text('TESTING').element('li').position('relative') )
                 .addComponent( ComponentFactory.Text('TESTING').element('li').position('relative') )
                 .addComponent( ComponentFactory.Text('TESTING').element('li').position('relative') )
                 .addComponent( ComponentFactory.Text('TESTING').element('li').position('relative') )
                 .addComponent( ComponentFactory.Text('TESTING').element('li').position('relative') )
                 .addComponent( ComponentFactory.Text('TESTING').element('li').position('relative') )
                 .addComponent( ComponentFactory.Text('TESTING').element('li').position('relative') )
                 .addComponent( ComponentFactory.Text('TESTING').element('li').position('relative') )
                 .addComponent( ComponentFactory.Text('TESTING').element('li').position('relative') )
        .background(background1).xy(15, 3).width(40).height(44).addClass('slide-right') );
        // Buttons
        this.add( ComponentFactory.TitleButton('RETURN').xy(1, 40).addClass('slide-right').addAction(menu) );
        this.add( ComponentFactory.TitleButton('REPLAY').xy(88, 40).addClass('slide-left').addAction(menu) );
        // Render
        this.clear();
        this.update();
    }
    
    /**
     * Load the profile screen.
     * @param playerModel the PlayerModel used for states
     */
    profile(playerModel) {
        log.info('loaded profile', arguments);
        // Reload function
        this.reload = function() {
            this.profile(playerModel);
        }
        // Actions
        var menu  = ComponentFactory.ClickAction(function() { vc.mainMenu(playerModel); });
        // Vectors
        
        // Buttons
        this.add( ComponentFactory.TitleButton('RETURN').xy(1, 40).addClass('slide-right').addAction(menu) );
        // Render
        this.clear();
        this.update();
    }
    
    /**
     * Load the credits.
     * @param playerModel the PlayerModel used for states
     */
    credits(playerModel) {
        log.info('loaded credits', arguments);
        // Reload function
        this.reload = function() {
            this.credits(playerModel);
        }
        // Actions
        var menu  = ComponentFactory.ClickAction(function() { vc.mainMenu(playerModel); });
        // Vectors
        
        // Buttons
        this.add( ComponentFactory.TitleButton('RETURN').xy(1, 40).addClass('slide-right').addAction(menu) );
        // Render
        this.clear();
        this.update();
    }
    
    /**
     * Override the current screen directly with HTML to display.
     * @param html the HTML to display
     */
    override(html) {
        log.info('overriding', arguments);
        this.parent.html(html);
    }
    
}
//==========================================================================================================================//