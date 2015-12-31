var Game = (function()
{
    'use strict';
    var game = {};

    game.color = function(index)
    {
        var options = ['white', 'blue', 'green', 'red', 'black'];
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

    return game;

})();
