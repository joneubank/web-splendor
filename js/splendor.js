var Splendor = (function()
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

    game.color = function(index)
    {
        var options = [];
        options[WHITE] = 'white';
        options[BLUE]  = 'blue';
        options[GREEN] = 'green';
        options[RED]   = 'red';
        options[BLACK] = 'black';
        options[GOLD] = 'gold';
        return options[index];
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

        return {
            getCost: function()
            {
                return [].concat(cost);
            },

            buildDom: function()
            {
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
                        costDiv.classList.add(game.color(i));
                        root.appendChild(costDiv);

                        var costSpan = document.createElement('span');
                        costSpan.innerText = cost[i];
                        costDiv.appendChild(costSpan);
                    }
                }

                return root;
            }
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
        return {

            getCost: function()
            {
                return [].concat(cost);
            },

            getPoints: function()
            {
                return this.points;
            },

            buildDom: function()
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

                var output = document.createElement('div');
                output.className = 'development ' + game.color(reward);

                var costs = document.createElement('div');
                costs.className = 'costs';
                output.appendChild(costs);

                for(var i = 0; i < 5; i++)
                {
                    var costDiv = document.createElement('div');
                    costDiv.classList.add('circle');
                    costDiv.classList.add(game.color(i));
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
                output.appendChild(pointsDiv);
                if(points > 0)
                {
                    var pointsValue = document.createElement('span');
                    pointsValue.innerText = points;
                    pointsDiv.appendChild(pointsValue);
                }

                return output;
            }

        };
    };

    game.Player = function(playerContainer, playerNumber)
    {
        var id = playerNumber;
        var tokens  = [0, 0, 0, 0, 0, 0];
        var gems    = [0, 0, 0, 0, 0];
        var points  = 0;

        var heldCards = [];

        var domObject = buildDom();
        var domElement = domObject.root;
        // var reservedCardHolder =

        function buildDom() {
            /*
            <div class="player" data-player="1">
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
            var output = {};

            var root = document.createElement('div');
            root.classList.add('player');
            output.root = root;

            var playerLeft = document.createElement('div');
            root.appendChild(playerLeft);
            playerLeft.classList.add('player-left');

            var points = document.createElement('div');
            playerLeft.appendChild(points);
            output.points = points;
            points.classList.add('player-points');

            var reservedCardWrapper = document.createElement('div');
            playerLeft.appendChild(reservedCardWrapper);
            output.reserved = reservedCardWrapper;
            reservedCardWrapper.classList.add('player-reserved');


            var hand = document.createElement('div');
            root.appendChild(hand);
            hand.classList.add('player-hand');

            output.colors = [];
            for(var i = 0; i < 6; i++) {
                var handColorContents = {};

                var colorRoot = document.createElement('div');
                colorRoot.classList.add('player-hand-color');
                hand.appendChild(colorRoot);

                var tokens = document.createElement('div');
                colorRoot.appendChild(tokens);
                handColorContents.tokens = tokens;
                tokens.classList.add('player-hand-tokens');
                tokens.classList.add(game.color(i));

                var gems = document.createElement('div');
                colorRoot.appendChild(gems);
                handColorContents.gems = gems;
                gems.classList.add('player-hand-gems');
                gems.classList.add(game.color(i));

                output.colors[i] = handColorContents;
                hand.appendChild(colorRoot);
            }

            return output;
        }



        return {
            getPoints: function() {
                return this.points;
            },

            getTokens: function()
            {
                return this.tokens;
            },

            buyDevelopment: function(development)
            {
                // add points and reward
                this.points += development.getPoints();
                this.gems[development.reward] += 1;

                //spend tokens
                for(var i = 0; i < 5; i++)
                {
                    this.tokens[i] -= development.cost[i]-this.gems[i];
                }

            },

            canBuyDevelopment: function(development) {
                var output = true;

                //check each token level
                for(var i = 0; i < 5; i++)
                {
                    if(this.tokens[i] + this.gems[i] < development.cost[i])
                    {
                        output = false;
                        break;
                    }
                }

                return output;
            },

            getDom: function() {
                return domElement;
            },


            updateDom: function {
            //points
            domObject.points.innerHTML = points;

            //tokens
            for(var i =0; i < 6; i++ ) {
                if(tokens[i] > 0) {
                    domObject.colors[i].tokens.innerHTML = tokens[i];
                }
            }

            //gems
            for(var i =0; i < 5; i++ ) {
                if(gems[i] > 0) {
                    domObject.colors[i].gems.innerHTML = gems[i];
                }
            }
        }





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
        game.Noble([0, 3, 3, 3, 0]),
        game.Noble([3, 3, 0, 0, 3]),
        game.Noble([4, 0, 0, 0, 4]),
        game.Noble([4, 4, 0, 0, 0]),
        game.Noble([0, 4, 4, 0, 0]),
        game.Noble([3, 3, 3, 0, 0]),
        game.Noble([3, 0, 0, 3, 0]),
        game.Noble([0, 0, 3, 3, 3]),
        game.Noble([0, 0, 0, 4, 3]),
        game.Noble([0, 0, 4, 4, 4])
    ];


    game.create = function(numPlayers)
    {
        /*
         *  Output
         * TODO: List of public members provided in created game object
         */
        var output = {};
        var decks = {};
        var turn = Math.floor(Math.random()*numPlayers);

        var players = [];
        var playerWrapper = document.getElementById('players-wrapper');

        //

        /*
            Private Methods:
        */
        function drawDevelopment(level, position)
        {
            var card = decks.developments[level].pop();
            output.dom.developments[level].appendChild(card.buildDom());

            var deckId = 'level-' + (level+1) + '-decksize';
            output.dom.decksizes[level].innerText = decks.developments[level].length;
        }

        function drawNoble()
        {
            var card = decks.nobles.pop();
            output.dom.nobles.appendChild(card.buildDom());
        }

        function takeToken(index)
        {
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

        function nextTurn() {
            //update active player turn
            players[turn].endTurn();
            turn += 1;
            if(turn >= numPlayers) {
                turn = 0;
            }

            players[turn].startTurn();



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

        // get the dom elements for the game
        output.dom = {};
        output.dom.developments = [];
        output.dom.developments[0] = document.getElementById('level-1');
        output.dom.developments[1] = document.getElementById('level-2');
        output.dom.developments[2] = document.getElementById('level-3');

        output.dom.decksizes = [];
        output.dom.decksizes[0] = document.getElementById('level-1-decksize');
        output.dom.decksizes[1] = document.getElementById('level-2-decksize');
        output.dom.decksizes[2] = document.getElementById('level-3-decksize');

        output.dom.nobles = document.getElementById('nobles');

        output.dom.tokenCounts = [
            document.getElementById('tokens-white'),
            document.getElementById('tokens-blue'),
            document.getElementById('tokens-green'),
            document.getElementById('tokens-red'),
            document.getElementById('tokens-black')
        ];

        output.dom.goldCount = document.getElementById('tokens-gold');

        /*
            Setup Game Initial State
        */

        for(var i = 0; i < numPlayers; i++)
        {
            var nextPlayer = game.Player();
            players.push(nextPlayer);

            playerWrapper.appendChild(nextPlayer.getDom());
            output.dom.players=playerWrapper;

            nextPlayer.updateDom();
        }

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
            drawDevelopment(0);
            drawDevelopment(1);
            drawDevelopment(2);
        }

        return output;
    };

    return game;

})();
