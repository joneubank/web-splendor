var Splendor = (function(container)
{
    'use strict';
    var game = {};
/*
Fisher-Yates shuffle
Code from Mike Bostock @ http://bost.ocks.org/mike/shuffle/
*/
    game.shuffle = function(array)
    {
        var m = array.length, t, i;

        // While there remain elements to shuffle…
        while (m) {

            // Pick a remaining element…
            i = Math.floor(Math.random() * m--);

            // And swap it with the current element.
            t = array[m];
            array[m] = array[i];
            array[i] = t;
        }

        return array;
    };

    //constant values, color names for array indecies
    var WHITE = 0;
    var BLUE  = 1;
    var GREEN = 2;
    var RED   = 3;
    var BLACK = 4;
    var GOLD  = 5;

    var _color = function(index)
    {
        var options = [];
        options[WHITE] = 'white';
        options[BLUE]  = 'blue';
        options[GREEN] = 'green';
        options[RED]   = 'red';
        options[BLACK] = 'black';
        options[GOLD]  = 'gold';
        return options[index];
    };

    //messages constant
    function playerTurnText(player)
    {
        return 'Player ' + (player+1) + '\'s turn!';
    }
    function playerFirstTurnText(player)
    {
        return 'Player ' + (player+1) + ' goes first!';
    }
    function gameWinnerText(player)
    {
        return 'Player ' + (player+1) + ' has won!';
    }
    game.messages = {
        turn:       playerTurnText,
        firstTurn:  playerFirstTurnText,
        gameWinner: gameWinnerText,
        button_newGame: "Start new game!",
        button_waiting:     'Make your move...'
    };

    game.Status = function()
    {
        /*
        <div id="statusBar">
            <div class="status-text">Message</div>
            <div class="action-utton"><div class="action-button-text">Action [Key]</div></div>
        </div>
        */
        var statusBar = document.createElement('div');
        statusBar.classList.add('statusBar');

        var statusText = document.createElement('div');
        statusText.classList.add('status-text');
        statusBar.appendChild(statusText);

        var button = document.createElement('div');
        button.classList.add('action-button');
        statusBar.appendChild(button);

        var buttonText = document.createElement('div');
        buttonText.classList.add('action-button-text');
        button.appendChild(buttonText);

        var buttonState = false;

        var setStatusText = function(text)
        {
            statusText.innerHTML = text;
        };

        var setButtonText = function(text)
        {
            buttonText.innerHTML = text;
        };

        /*
            true or false for active state
        */
        var setButtonState = function(state)
        {
            if(state)
            {
                buttonState = true;
                button.classList.add('active');

            } else
            {
                buttonState = false;
                button.classList.remove('active');
            }
        };

        var isButtonActive = function()
        {
            return buttonState ? true : false;
        };

        return {
            domRoot: statusBar,
            statusText: statusText,
            button: button,
            setStatusText: setStatusText,
            setButtonText: setButtonText,
            setButtonState: setButtonState,
            isButtonActive: isButtonActive
        };
    };


    /*
        cost is an array of length 5 with the number of gems (permanent tokens)
            required to earn the Noble
        All Nobles give 3 points
    */
    game.Noble = function(cost)
    {
        var colors = 0;
        for(var i = 0; i < 5; i++)
        {
            if(cost[i] > 0)
            {
                colors += 1;
            }
        }

        /*
        <div class="noble three-color">
            <div class="cost white">    <span>3</span></div>
            <div class="cost red">      <span>3</span></div>
            <div class="cost black">    <span>3</span></div>
        </div>
        */

        var root = document.createElement('div');
        var colorsClassName = colors === 2 ? 'two-color' : 'three-color';
        root.classList.add('noble');
        root.classList.add(colorsClassName);

        //loop for each color
        for(var i = 0; i < 5; i++)
        {
            if(cost[i] > 0)
            {
                var costDiv = document.createElement('div');
                costDiv.classList.add('cost');
                costDiv.classList.add(_color(i));
                root.appendChild(costDiv);

                var costSpan = document.createElement('span');
                costSpan.innerText = cost[i];
                costDiv.appendChild(costSpan);
            }
        }

        function getCost()
        {
            return [].concat(cost);
        }

        return {
            domRoot: root,
            getCost: getCost
        };
    };


    /*
        reward is array index 0-4
        points is number of prestige points
        cost is an array of length 5 with the number of tokens required to
            purchase development
    */
    game.Development = function(reward, points, cost)
    {

        var domRoot = null;

        function getCost()
        {
            return [].concat(cost);
        }

        function getPoints()
        {
            return this.points;
        }

        /*
            Using a method to build dom at a time later than when the object is
                created. THis allows us to have a long list without building
                uneeded DOM elements
        */
        function buildDom()
        {
            /*
                DOM model that is built here:

                <div class="development white" data-dev="1">
                    <div class="costs">
                        <div class="circle white">  <span>1</span>  </div>
                        <div class="circle blue">   <span>2</span>  </div>
                        <div class="circle green">  <span>3</span>  </div>
                        <div class="circle red">    <span>4</span>  </div>
                        <div class="circle black nocost"><span>0</span></div>
                    </div>
                    <div class="prestige">  <span>1</span>  </div>
                </div>
                */

                this.domRoot = document.createElement('div');
                this.domRoot.className = 'development ' + _color(reward);

                var costs = document.createElement('div');
                costs.className = 'costs';
                this.domRoot.appendChild(costs);

                for(var i = 0; i < 5; i++)
                {
                    var costDiv = document.createElement('div');
                    costDiv.classList.add('circle');
                    costDiv.classList.add(_color(i));
                    costs.appendChild(costDiv);
                    if(cost[i] === 0)
                    {
                        costDiv.classList.add('nocost');
                    }
                    var costValue = document.createElement('span');
                    costValue.innerText = cost[i];
                    costDiv.appendChild(costValue);
                }

                var pointsDiv = document.createElement('div');
                pointsDiv.className = 'prestige';
                this.domRoot.appendChild(pointsDiv);
                if(points > 0)
                {
                    var pointsValue = document.createElement('span');
                    pointsValue.innerText = points;
                    pointsDiv.appendChild(pointsValue);
                }
        }

        return {
            domRoot: domRoot,
            getCost: getCost,

            getPoints: getPoints,

            buildDom: buildDom

        };
    };

    game.Player = function(playerNumber, isFirst)
    {
        //explicitly make isFirst false if not defined
        isFirst = isFirst !== undefined ? isFirst : false;

        var id = playerNumber;
        var tokens  = [0, 0, 0, 0, 0, 0];
        var gems    = [0, 0, 0, 0, 0];
        var points  = 0;

        var heldCards = [];
        var dom = {};

        /*

        // Going to build the DOM next, based on the following model

        <div class="player" data-player="1">
            <div id="player1">1</div> <!-- optional, only for first player -->
            <div class="player-left">
                <div class="player-points">5</div>
                <div class="player-reserved">
                    <div class="player-reserved-card level-2"></div>
                    <div class="player-reserved-card level-1"></div>
                    <div class="player-reserved-card level-3"></div>
                </div>
            </div>
            <div class="player-hand">
                <div class="player-hand-color">
                    <div class="player-hand-tokens white"></div>
                    <div class="player-hand-gems white"></div>
                </div>
                <div class="player-hand-color">
                    <div class="player-hand-tokens blue"></div>
                    <div class="player-hand-gems blue"></div>
                </div>
                <div class="player-hand-color">
                    <div class="player-hand-tokens green"></div>
                    <div class="player-hand-gems green"></div>
                </div>
                <div class="player-hand-color">
                    <div class="player-hand-tokens red"></div>
                    <div class="player-hand-gems red"></div>
                </div>
                <div class="player-hand-color">
                    <div class="player-hand-tokens black"></div>
                    <div class="player-hand-gems black"></div>
                </div>
                <div class="player-hand-color">
                    <div class="player-hand-tokens gold"></div>
                </div>
            </div>
        </div>
        */

        //build dom into object where output.root is the root of the element
        var root = document.createElement('div');
        dom.root = root;
        root.classList.add('player');

        if(isFirst)
        {
            //add in the first player indicator if this is the first player
            var player1Token = document.createElement('div');
            root.appendChild(player1Token);
            player1Token.classList.add('player1token');
            player1Token.innerHTML = '1';
        }

        var playerLeft = document.createElement('div');
        root.appendChild(playerLeft);
        playerLeft.classList.add('player-left');

        var pointsDiv = document.createElement('div');
        playerLeft.appendChild(pointsDiv);
        dom.points = pointsDiv;
        pointsDiv.classList.add('player-points');

        var reservedCardWrapper = document.createElement('div');
        playerLeft.appendChild(reservedCardWrapper);
        dom.reserved = reservedCardWrapper;
        reservedCardWrapper.classList.add('player-reserved');


        var hand = document.createElement('div');
        root.appendChild(hand);
        hand.classList.add('player-hand');

        dom.colors = [];
        for(var i = 0; i < 6; i++) {
            var handColorContents = {};

            var colorRoot = document.createElement('div');
            colorRoot.classList.add('player-hand-color');
            hand.appendChild(colorRoot);

            var tokens = document.createElement('div');
            colorRoot.appendChild(tokens);
            handColorContents.tokens = tokens;
            tokens.classList.add('player-hand-tokens');
            tokens.classList.add(_color(i));

            var gemsDiv = document.createElement('div');
            colorRoot.appendChild(gemsDiv);
            handColorContents.gemsDiv = gemsDiv;
            gemsDiv.classList.add('player-hand-gems');
            gemsDiv.classList.add(_color(i));

            dom.colors[i] = handColorContents;
            hand.appendChild(colorRoot);
        }

        function setActive(state)
        {
            if(state)
            {
                dom.root.classList.add('turn');

            } else
            {
                dom.root.classList.remove('turn');
            }
        }

        function buyDevelopment(development)
        {
            //spend tokens first
            var bufferTokens = [].concat(this.tokens);

            //spend tokens
            for(var i = 0; i < 5; i++)
            {
                var tokensLeft = this.tokens[i]- development.cost[i] - this.gems[i];

                if(tokensLeft >= 0)
                {
                    bufferTokens[i] = tokensLeft;

                } else
                {
                    //use gold
                    bufferTokens[5] = this.tokens[5]-tokensLeft;
                }
            }

            if(bufferTokens[5] >= 0)
            {
                this.tokens = bufferTokens;
                this.points += development.getPoints();
                // add points and reward
                this.gems[development.reward] += 1;

                this.updateDom();

                return true;
            } else {
                //Can't buy this!!!! What is the game thinking sending you here?!
                console.log('Can\'t afford card you are trying to buy! Shouldn\'t arrive here!');
                return false;
            }

        }

        function canBuyDevelopment(development)
        {
            var goldNeeded = 0;

            //check each token level
            for(var i = 0; i < 5; i++)
            {
                if(tokens[i] + gems[i] < development.cost[i])
                {
                    goldNeeded += development.cost[i] - tokens[i] - gems[i];
                }
            }

            if(goldNeeded <= tokens[5])
            {
                return true;

            } else
            {
                return false;
            }
        }

        function updateDom()
        {
            //points
            dom.points.innerHTML = points;

            //tokens
            for(var i =0; i < 6; i++ ) {
                var textValue = tokens[i];

                if(tokens[i] == 0 || !textValue) {
                    textValue = '';
                }
                dom.colors[i].tokens.innerHTML = textValue;
            }

            //gems
            for(var i =0; i < 5; i++ ) {
                var textValue = gems[i];

                if(gems[i] == 0 || !textValue) {
                    textValue = '';
                }

                dom.colors[i].gemsDiv.innerHTML = textValue;
            }
        }

        return {
            dom: dom,
            points: points,
            tokens: tokens,
            gems: gems,

            setActive: setActive,
            buyDevelopment: buyDevelopment,
            canBuyDevelopment: canBuyDevelopment,
            updateDom: updateDom

        };
    };

    var masterDecks = {};
    masterDecks.level1 = [
        /* level 1 white
        white       1u+1g+1r+1k         1   1   1   1
                    1u+2g+1r+1k         1   2   1   1
                    2u+2g+1k            2   2       1
                    3w+1u+1k        3   1           1
                    2r+1k                       2   1
                    2u+2k               2           2
                    3u                  3
                1   4g                      4
        */
            game.Development(WHITE,0,[0,1,1,1,1]),
            game.Development(WHITE,0,[0,1,2,1,1]),
            game.Development(WHITE,0,[0,2,2,0,1]),
            game.Development(WHITE,0,[3,1,0,0,1]),
            game.Development(WHITE,0,[0,0,0,2,1]),
            game.Development(WHITE,0,[0,2,0,0,2]),
            game.Development(WHITE,0,[0,3,0,0,0]),
            game.Development(WHITE,1,[0,0,4,0,0]),
        /* level 1 blue
        blue        1w+1g+1r+1k 1       1   1   1
                    1w+1g+2r+1k 1       1   2   1
                    1w+2g+2r    1       2   2
                    1u+3g+1r        1   3   1
                    1w+2k       1               2
                    2g+2k               2       2
                    3k                          3
                1   4r                      4
        */
            game.Development(BLUE ,0,[1,0,1,1,1]),
            game.Development(BLUE ,0,[1,0,1,2,1]),
            game.Development(BLUE ,0,[1,0,2,2,0]),
            game.Development(BLUE ,0,[0,1,3,1,0]),
            game.Development(BLUE ,0,[1,0,0,0,2]),
            game.Development(BLUE ,0,[0,0,2,0,2]),
            game.Development(BLUE ,0,[0,0,0,0,3]),
            game.Development(BLUE ,1,[0,0,0,4,0]),
        /* level 1 green
            points      wh  bu  gr  re  bk
            0           1   1       1   1
            0           1   1       1   2
            0               1       2   2
            0           1   3   1
            0           2   1
            0               2       2
            0                       3
            1                           4
        */
            game.Development(GREEN ,0,[1,1,0,1,1]),
            game.Development(GREEN ,0,[1,1,0,1,2]),
            game.Development(GREEN ,0,[0,1,0,2,2]),
            game.Development(GREEN ,0,[1,3,1,0,0]),
            game.Development(GREEN ,0,[2,1,0,0,0]),
            game.Development(GREEN ,0,[0,2,0,2,0]),
            game.Development(GREEN ,0,[0,0,0,3,0]),
            game.Development(GREEN ,1,[0,0,0,0,4]),

        /*level 1 red
            points      wh  bu  gr  re  bk
            0           1   1   1       1
            0           2   1   1       1
            0           2       1       2
            0           1           1   3
            0               2   1
            0           2           2
            0           3
            1           4
        */
            game.Development(RED ,0,[1,1,1,0,1]),
            game.Development(RED ,0,[2,1,1,0,1]),
            game.Development(RED ,0,[2,0,1,0,2]),
            game.Development(RED ,0,[1,0,0,1,3]),
            game.Development(RED ,0,[0,2,1,0,0]),
            game.Development(RED ,0,[2,0,0,2,0]),
            game.Development(RED ,0,[3,0,0,0,0]),
            game.Development(RED ,1,[4,0,0,0,0]),

        /* black
            points      wh  bu  gr  re  bk
            0           1   1   1   1
            0           1   2   1   1
            0           2   2       1
            0                   1   3   1
            0                   2   1
            0           2       2
            0                   3
            1               4
        */
            game.Development(BLACK ,0,[1,1,1,1,0]),
            game.Development(BLACK ,0,[1,2,1,1,0]),
            game.Development(BLACK ,0,[2,2,0,1,0]),
            game.Development(BLACK ,0,[0,0,1,3,1]),
            game.Development(BLACK ,0,[0,0,2,1,0]),
            game.Development(BLACK ,0,[2,0,2,0,0]),
            game.Development(BLACK ,0,[0,0,3,0,0]),
            game.Development(BLACK ,1,[0,4,0,0,0])
    ];

    masterDecks.level2 = [
        /* level 2 white
            points      wh  bu  gr  re  bk
            1                   3   2   2
            1           2   3       3
            2                   1   4   2
            2                       5   3
            2                       5
            3           6
        */
        game.Development(WHITE,1,[0,0,3,2,2]),
        game.Development(WHITE,1,[2,3,0,3,0]),
        game.Development(WHITE,2,[0,0,1,4,2]),
        game.Development(WHITE,2,[0,0,0,5,3]),
        game.Development(WHITE,2,[0,0,0,5,0]),
        game.Development(WHITE,3,[6,0,0,0,0]),

        /* level 2 blue
            points      wh  bu  gr  re  bk
            1               2   2   3
            1               2   3       3
            2           5   3
            2           2           1   4
            2               5
            3               6
        */
        game.Development(BLUE,1,[0,2,2,3,0]),
        game.Development(BLUE,1,[0,2,3,0,3]),
        game.Development(BLUE,2,[5,3,0,0,0]),
        game.Development(BLUE,2,[2,0,0,1,4]),
        game.Development(BLUE,2,[0,5,0,0,0]),
        game.Development(BLUE,3,[0,6,0,0,0]),

        /* level 2 green
            points      wh  bu  gr  re  bk
            1           3       2   3
            1           2   3           2
            2           4   2           1
            2               5   3
            2                   5
            3                   6
        */
        game.Development(GREEN,1,[3,0,2,3,0]),
        game.Development(GREEN,1,[2,3,0,0,2]),
        game.Development(GREEN,2,[4,2,0,0,1]),
        game.Development(GREEN,2,[0,5,3,0,0]),
        game.Development(GREEN,2,[0,0,5,0,0]),
        game.Development(GREEN,3,[0,0,6,0,0]),

        /* level 2 red
            points      wh  bu  gr  re  bk
            1           2           2   3
            1               3       2   3
            2           1   4   2
            2           3               5
            2                           5
            3                       6
        */
        game.Development(RED,1,[2,0,0,2,3]),
        game.Development(RED,1,[0,3,0,2,3]),
        game.Development(RED,2,[1,4,2,0,0]),
        game.Development(RED,2,[3,0,0,0,5]),
        game.Development(RED,2,[0,0,0,0,5]),
        game.Development(RED,3,[0,0,0,6,0]),

        /* level 2 black
            points      wh  bu  gr  re  bk
            1           3   2   2
            1           3       3       2
            2               1   4   2
            2                   5   3
            2           5
            3                           6
        */
        game.Development(BLACK,1,[3,2,2,0,0]),
        game.Development(BLACK,1,[3,0,3,0,2]),
        game.Development(BLACK,2,[0,1,4,2,0]),
        game.Development(BLACK,2,[0,0,5,3,0]),
        game.Development(BLACK,2,[5,0,0,0,0]),
        game.Development(BLACK,3,[0,0,0,0,6])
    ];

    masterDecks.level3 = [
        /* level 3 white
            points      wh  bu  gr  re  bk
            3               3   3   5   3
            4                           7
            4           3           3   6
            5           3               7
        */
        game.Development(WHITE,3,[0,3,3,5,3]),
        game.Development(WHITE,4,[0,0,0,0,7]),
        game.Development(WHITE,4,[3,0,0,3,6]),
        game.Development(WHITE,5,[3,0,0,0,7]),

        /* level 3 blue
            points      wh  bu  gr  re  bk
            3           3       3   3   5
            4           7
            4           6   3           3
            5           7   3
        */
        game.Development(BLUE,3,[3,0,3,3,5]),
        game.Development(BLUE,4,[7,0,0,0,0]),
        game.Development(BLUE,4,[6,3,0,0,3]),
        game.Development(BLUE,5,[7,3,0,0,0]),

        /* level 3 green
            points      wh  bu  gr  re  bk
            3           5   3       3   3
            4               7
            4           3   6   3
            5               7   3
        */
        game.Development(GREEN,3,[5,3,0,3,3]),
        game.Development(GREEN,4,[0,7,0,0,0]),
        game.Development(GREEN,4,[3,6,3,0,0]),
        game.Development(GREEN,5,[0,7,3,0,0]),

        /* level 3 red
            points      wh  bu  gr  re  bk
            3           3   5   3       3
            4                   7
            4               3   6   3
            5                   7   3
        */
        game.Development(RED,3,[3,5,3,0,3]),
        game.Development(RED,4,[0,0,7,0,0]),
        game.Development(RED,4,[0,3,6,3,0]),
        game.Development(RED,5,[0,0,7,3,0]),

        /* level 3 black
            points      wh  bu  gr  re  bk
            3           3   3   5   3
            4                       7
            4                   3   6   3
            5                       7   3
        */
        game.Development(BLACK,3,[3,3,5,3,0]),
        game.Development(BLACK,4,[0,0,0,7,0]),
        game.Development(BLACK,4,[0,0,3,6,3]),
        game.Development(BLACK,5,[0,0,0,7,3])
    ];

    masterDecks.nobles = [
        /*
        w b g r bk
        0 3 3 3 0
        3 3 0 0 3
        4 0 0 0 4
        4 4 0 0 0
        0 4 4 0 0
        3 3 3 0 0
        3 0 0 3 3
        0 0 3 3 3
        0 0 0 4 4
        0 0 4 4 0
        */
        game.Noble([3, 3, 3, 0, 0]),
        game.Noble([0, 3, 3, 3, 0]),
        game.Noble([0, 0, 3, 3, 3]),
        game.Noble([3, 0, 0, 3, 3]),
        game.Noble([3, 3, 0, 0, 3]),
        game.Noble([4, 4, 0, 0, 0]),
        game.Noble([0, 4, 4, 0, 0]),
        game.Noble([0, 0, 4, 4, 0]),
        game.Noble([0, 0, 0, 4, 4]),
        game.Noble([4, 0, 0, 0, 4]),
    ];


    game.create = function(container, numPlayers)
    {

        /*
         *  Game State Variables
         */
        var output = {};
        var decks = {};

        var gameOverPoints = 0;

        var nobles = [];
        var developments = [[],[],[]];

        var firstPlayer = Math.floor(Math.random()*numPlayers);
        var turn = firstPlayer;

        var players = [];


        /*
            Private Methods:
        */
        function buildTokens()
        {
            /*
                <div id="tokens">
                    <div class="token-holder">
                        <div class="token circle gold"><span id="tokens-gold"></span></div>
                    </div>
                    <div class="token-holder" data>
                        <div class="token circle white"><span id="tokens-white"></span></div>
                    </div>
                    <div class="token-holder">
                        <div class="token circle blue"><span id="tokens-blue"></span></div>
                    </div>
                    <div class="token-holder">
                        <div class="token circle green"><span id="tokens-green"></span></div>
                    </div>
                    <div class="token-holder">
                        <div class="token circle red"><span id="tokens-red"></span></div>
                    </div>
                    <div class="token-holder">
                        <div class="token circle black"><span id="tokens-black"></span></div>
                    </div>
                </div>
            */

            var tokens = document.createElement('div');
            tokens.setAttribute('id', 'tokens');

            function createTokenHolder(color) {
                var root = document.createElement('div');
                root.classList.add('token-holder');

                var token = document.createElement('div');
                token.classList.add('token');
                token.classList.add('circle');
                token.classList.add(color);
                root.appendChild(token);

                var count = document.createElement('span');
                var id = 'tokens-' + color;
                count.setAttribute('id', id);
                token.appendChild(count);

                return root;
            }

            tokens.appendChild(createTokenHolder(_color(GOLD)));
            for(var i = 0; i < 5; i++)
            {
                tokens.appendChild(createTokenHolder(_color(i)));
            }
            return tokens;
        }

        function buildMarket()
        {
            /*
                <div id="market">
                    <div id="nobles"></div>

                    <div id="levels-wrapper">
                        <div id="level-1" class="market-level">
                            <div class="development deck"><span>1 - (<span id="level-1-decksize">20</span>)</span></div>
                        </div>
                        <div id="level-2" class="market-level">
                            <div class="development deck"><span>2 - (<span id="level-2-decksize">20</span>)</span></div>
                        </div>
                        <div id="level-3" class="market-level">
                            <div class="development deck"><span>3 - (<span id="level-3-decksize">20</span>)</span></div>
                        </div>
                    </div>
                </div>
            */

            var market = document.createElement('div');
            market.setAttribute('id','market');

            var nobles = document.createElement('div');
            market.appendChild(nobles);
            nobles.setAttribute('id','nobles');

            var levelsWrapper = document.createElement('div');
            market.appendChild(levelsWrapper);
            levelsWrapper.setAttribute('id','levels-wrapper');

            function marketLevel(num) {
                var root = document.createElement('div');
                root.classList.add('market-level');

                var rootId = 'level-' + num;
                root.setAttribute('id', rootId);

                var deck = document.createElement('div');
                deck.classList.add('development');
                deck.classList.add('deck');
                root.appendChild(deck);

                var outerSpan = document.createElement('span');
                deck.appendChild(outerSpan);

                var leadText = document.createTextNode(num + ' - (');
                outerSpan.appendChild(leadText);

                var innerSpan = document.createElement('span');
                var deckSizeId = 'level-' + num + '-decksize';
                innerSpan.setAttribute('id',deckSizeId);
                outerSpan.appendChild(innerSpan);

                var trailText = document.createTextNode(num + ')');
                outerSpan.appendChild(trailText);

                return root;
            }
            for(var i = 1; i <= 3; i++) {
                var marketLevelNode = marketLevel(i);
                levelsWrapper.appendChild(marketLevelNode);
            }

            return market;

        }
        function getDomNodes() {
            var dom = {};
            dom.developments = [];
            dom.developments[0] = document.getElementById('level-1');
            dom.developments[1] = document.getElementById('level-2');
            dom.developments[2] = document.getElementById('level-3');

            dom.decksizes = [];
            dom.decksizes[0] = document.getElementById('level-1-decksize');
            dom.decksizes[1] = document.getElementById('level-2-decksize');
            dom.decksizes[2] = document.getElementById('level-3-decksize');

            dom.nobles = document.getElementById('nobles');

            dom.tokenCounts = [
                document.getElementById('tokens-white'),
                document.getElementById('tokens-blue'),
                document.getElementById('tokens-green'),
                document.getElementById('tokens-red'),
                document.getElementById('tokens-black')
            ];

            dom.goldCount = document.getElementById('tokens-gold');

            return dom;
        }
        function drawDevelopment(level, position)
        {
            var card = decks.developments[level].pop();
            if(!card.domRoot)
            {
                card.buildDom();
            }
            developments[level][position] = card;

            //update listed deck size
            var deckId = 'level-' + (level+1) + '-decksize';
            output.dom.decksizes[level].innerText = decks.developments[level].length;


            //the attaching developments part
            if(developments[level][position+1])
            {
                //there is an element we should attach this in front of
                output.dom.developments[level].insertBefore(
                    card.domRoot,
                    developments[level][position+1].domRoot
                );

            } else
            {
                output.dom.developments[level].appendChild(card.domRoot);
            }

        }

        function drawNoble() {
            var noble = decks.nobles.pop();
            nobles.push(noble);
            output.dom.nobles.appendChild(noble.domRoot);
        }

        function takeToken(index) {
            tokens[index] -= 1;
            output.dom.tokenCounts[index].innerText = tokens[index];
        }

        function addToken(index) {
            tokens[index] += 1;
            output.dom.tokenCounts[index].innerText = tokens[index];
        }

        function takeGold() {
            gold -= 1;
            output.dom.goldCounts = gold;
        }

        function addGold() {
            gold += 1;
            output.dom.goldCounts = gold;
        }

        function isEndGameReached() {
            var output = false;
            for(var i = 0; i < players.length; i++) {
                if(players[i].points >= gameOverPoints) {
                    output = true;
                    break;
                }
            }
            return output;
        }

        function getWinningPlayer() {
            //output holds the current leader player index
            var output = 0;
            var bestPoints = 0;
            for(var i = 0; i < players.length; i++) {
                if(players[i].points > bestPoints) {
                    bestPoints = players[i].points;
                    output = i;
                } else if(players[i].points === bestPoints) {
                    var currentLeaderGems = players[output].gems.reduce(function(next,total){return next+total;});
                    var challengerGems    = players[i].gems.reduce(function(next,total){return next+total;});

                    if(challengerGems > currentLeaderGems) {
                        output = i;
                    } else if (challengerGems === currentLeaderGems) {
                        //get player that had later turn
                        var currentLeaderOrder = firstPlayer - output;
                        if(currentLeaderOrder < 0) {
                            currentLeaderOrder += players.length;
                        }

                        var challengerOrder = firstPlayer - i;
                        if(challengerOrder < 0) {
                            challengerOrder += players.length;
                        }

                        if(challengerOrder > currentLeaderOrder) {
                            output = i;
                        }
                    }

                }
            }

            return output;
        }

        function nextTurn() {


            /*
            Process Player Action
            */

            /*
            After Player Action
            */
            //disable status bar button
            statusBar.setButtonState(false);

            //check if we hit end game
            var endGame = isEndGameReached();

            turn += 1;
            if(turn >= numPlayers) {
                turn = 0;
            }

            //update active player turn
            players[turn].setActive(false);

            if(!endGame || !(turn === firstPlayer)){
                //set next player active unless game is over
                players[turn].setActive(true);
            }

            if(endGame) {
                //update player layouts to disable players that get no more turns
                //TODO

                if(turn === firstPlayer) {
                    var winningPlayer = getWinningPlayer();
                    statusBar.setStatusText(game.gameOverWithWinner(winningPlayer));
                }
            } else {

            }




            //update status bar for new turn ("turn + 1" for display number value)
            statusBar.setStatusText(game.messages.turn(turn));
        }

        /*
            Decks Setup
        */
        // make copies of all decks to play with, then shuffle them
        decks.developments = [];
        decks.developments[0] = [].concat(masterDecks.level1);
        decks.developments[1] = [].concat(masterDecks.level2);
        decks.developments[2] = [].concat(masterDecks.level3);
        decks.nobles = [].concat(masterDecks.nobles);

        game.shuffle(decks.developments[0]);
        game.shuffle(decks.developments[1]);
        game.shuffle(decks.developments[2]);
        game.shuffle(decks.nobles);

        /*
            DOM Setup
        */
        //clear container
        while (container.lastChild) {
            container.removeChild(container.lastChild);
        }
        //setup game DOM
        var tokensDom = buildTokens();
        container.appendChild(tokensDom);

        var marketDom = buildMarket();
        container.appendChild(marketDom);


        output.dom = getDomNodes();

        //status bar
        var statusBar = game.Status();
        container.insertBefore(statusBar.domRoot, container.firstChild);
        statusBar.setButtonText(game.messages.button_waiting);
        statusBar.setStatusText(game.messages.firstTurn(firstPlayer));

        //playerWrapper
        var playerWrapper = document.createElement('div');
        container.appendChild(playerWrapper);
        playerWrapper.id = 'players-wrapper';

        /*
            Setup Game Initial State
        */
        for(var i = 0; i < numPlayers; i++)
        {
            var nextPlayer = game.Player(i, i === firstPlayer);
            players.push(nextPlayer);

            playerWrapper.appendChild(nextPlayer.dom.root);
            output.dom.players=playerWrapper;

            nextPlayer.updateDom();
        }

        players[turn].setActive(true);

        //Tokens setup
        var tokenMax;
        switch(numPlayers)
        {
            case 3:
                tokenMax = 5;
                break;
            case 2:
                tokenMax = 4;
                break;
            case 4:
            default:
                tokenMax = 7;
        }

        var tokens = [tokenMax, tokenMax, tokenMax, tokenMax, tokenMax];
        for(var i = 0; i < 5; i++)
        {
             output.dom.tokenCounts[i].innerText = tokens[i];
        }
        var gold = 5;
        output.dom.goldCount.innerText = gold;


        //setup nobles
        var nobles = [];
        for(var i = 0; i < numPlayers + 1; i++)
        {
            nobles.push(drawNoble());

        }

        //draw initial cards
        for(var i = 0; i < 4; i++)
        {
            drawDevelopment(0, i);
            drawDevelopment(1, i);
            drawDevelopment(2, i);
        }

        output.test = function() {
            nextTurn();
        };

        return output;
    };

    function clickActionButton() {

    }

    return {
        create: game.create,
        actionButton: clickActionButton
    };

})();
