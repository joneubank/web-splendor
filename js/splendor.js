
var Game = (function()
{
    'use strict';
    var game = {};
/*
Fisher-Yates shuffle
Code from Mike Bostock @ http://bost.ocks.org/mike/shuffle/
*/
    game.shuffle = function(array) {
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

    var _white = 0;
    var _blue  = 1;
    var _green = 2;
    var _red   = 3;
    var _black = 4;

    game.color = function(index)
    {
        var options = [];
        options[_white] = 'white';
        options[_blue]  = 'blue';
        options[_green] = 'green';
        options[_red]   = 'red';
        options[_black] = 'black';
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

            buildDom: function()
            {
                /*
                <div class="development white" data-dev="1">
                    <div class="costs">
                        <div class="circle white">  <span>1</span>  </div>
                        <div class="circle blue">   <span>2</span>  </div>
                        <div class="circle green">  <span>3</span>  </div>
                        <div class="circle red">    <span>4</span>  </div>
                        <div class="circle black">  <span>5</span>  </div>
                    </div>
                    <div class="prestige">      <span>1</span>  </div>
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
        var tokens = [];
        var points = 0;

        return
        {

        };
    };

    game.decks = {};
    game.decks.level1 = [
    /*
    white       1u+1g+1r+1k         1   1   1   1
                1u+2g+1r+1k         1   2   1   1
                2u+2g+1k            2   2       1
                3w+1u+1k        3   1           1
                2r+1k                       2   1
                2u+2k               2           2
                3u                  3
            1   4g                      4
    */
        game.Development(_white,0,[0,1,1,1,1]),
        game.Development(_white,0,[0,1,2,1,1]),
        game.Development(_white,0,[0,2,2,0,1]),
        game.Development(_white,0,[3,1,0,0,1]),
        game.Development(_white,0,[0,0,0,2,1]),
        game.Development(_white,0,[0,2,0,0,2]),
        game.Development(_white,0,[0,3,0,0,0]),
        game.Development(_white,1,[0,0,4,0,0]),
    /*
    blue        1w+1g+1r+1k 1       1   1   1
                1w+1g+2r+1k 1       1   2   1
                1w+2g+2r    1       2   2
                1u+3g+1r        1   3   1
                1w+2k       1               2
                2g+2k               2       2
                3k                          3
            1   4r                      4
    */
        game.Development(_blue ,0,[1,0,1,1,1]),
        game.Development(_blue ,0,[1,0,1,2,1]),
        game.Development(_blue ,0,[1,0,2,2,0]),
        game.Development(_blue ,0,[0,1,3,1,0]),
        game.Development(_blue ,0,[1,0,0,0,2]),
        game.Development(_blue ,0,[0,0,2,0,2]),
        game.Development(_blue ,1,[0,0,0,0,3]),
        game.Development(_blue ,1,[0,0,0,4,0])
    ];



    return game;

})();
