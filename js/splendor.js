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

    game.color = function(index)
    {
        var options = [];
        options[WHITE] = 'white';
        options[BLUE]  = 'blue';
        options[GREEN] = 'green';
        options[RED]   = 'red';
        options[BLACK] = 'black';
        return options[index];
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
                output.className = "development " + game.color(reward);

                var costs = document.createElement('div');
                costs.className = "costs";
                output.appendChild(costs);

                for(var i = 0; i < 5; i++)
                {
                    var costDiv = document.createElement('div');
                    costDiv.className = "circle " + game.color(i);
                    costs.appendChild(costDiv);
                    if(cost[i] === 0)
                    {
                        costDiv.className = costDiv.className + " nocost";
                    }
                        var costValue = document.createElement('span');
                        costValue.innerText = cost[i];
                        costDiv.appendChild(costValue);
                }

                var pointsDiv = document.createElement('div');
                pointsDiv.className = "prestige";
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

    game.Player = function()
    {
        var tokens  = [0, 0, 0, 0, 0];
        var gems    = [0, 0, 0, 0, 0];
        var points  = 0;

        return {
            getPoints: function()
            {
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

            canBuyDevelopment: function(development)
            {
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
            }

        };
    };

    game.decks = {};
    game.decks.level1 = [
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

    game.decks.level2 = [
        /* level 2 white
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

    game.decks.level3 = [
        /* level 3 white
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
            3           3   5   3       3
            4                   7
            4               3   6   3
            5                   7   3
        */
        game.Development(GREEN,3,[3,5,3,0,3]),
        game.Development(GREEN,4,[0,0,7,0,0]),
        game.Development(GREEN,4,[0,3,6,3,0]),
        game.Development(GREEN,5,[0,0,7,3,0]),

        /* level 3 black
            3           3   3   5   3
            4                       7
            4                   3   6   3
            5                       7   3
        */
        game.Development(GREEN,3,[3,3,5,3,0]),
        game.Development(GREEN,4,[0,0,0,7,0]),
        game.Development(GREEN,4,[0,0,3,6,3]),
        game.Development(GREEN,5,[0,0,0,7,3])
    ];

    game.create = function(numPlayers)
    {
        var output = {};

        var players = [];
        for(var i = 0; i < numPlayers; i++)
        {
            players.push(game.Player());
        }

        // make copies of all decks to play with, then shuffle them
        output.decks = {};
        output.decks.developments = []
        output.decks.developments[0] = [].concat(game.decks.level1);
        output.decks.developments[1] = [].concat(game.decks.level2);
        output.decks.developments[2] = [].concat(game.decks.level3);

        game.shuffle(output.decks.developments[0]);
        game.shuffle(output.decks.developments[1]);
        game.shuffle(output.decks.developments[2]);

        // get the dom elements for the game
        output.dom = {};
        output.dom.developments = [];
        output.dom.developments[0] = document.getElementById("level-1");
        output.dom.developments[1] = document.getElementById("level-2");
        output.dom.developments[2] = document.getElementById("level-3");

        output.drawDevelopment = function(level)
        {
            var card = output.decks.developments[level].pop();
            this.dom.developments[level].appendChild(card.buildDom());
        };

        //draw initial cards
        for(var i = 0; i < 4; i++)
        {
            output.drawDevelopment(0);
            output.drawDevelopment(1);
            output.drawDevelopment(2);
        }

        return output;
    };

    return game;

})();

