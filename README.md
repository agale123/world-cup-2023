# 2023 Women's World Cup App

Hosted location: https://world-cup-2023-356601.wn.r.appspot.com/

The app will have sections to explore game locations, browse the schedule, and
plan an itinerary for the tournament. This is a followup of a version I made
for the 2019 World Cup which can be found here:
https://worldcup.alisongale.com.

## Schedule

This section allows you to interactively explore the schedule. The first set of
controls filters games by country and/or city. The second control lets you
configure the timezone that should be used to render game times. The final set
of controlls allows you to see which knockout games a team will play in if they
finish first or second in their group. So you could see where the US would play
if they finish first in their group.

<img src="https://raw.githubusercontent.com/agale123/world-cup-2023/master/images/schedule.jpg" width="500px">

## Map

This section highlights the path that each country will take in the group stage.
You can also opt to see what their knockout path would be if they finishe first
or second in their group. Facts about each country are displayed alongside the
map.

<img src="https://raw.githubusercontent.com/agale123/world-cup-2023/master/images/map.jpg" width="500px">

## Itinerary

This section uses an optimiztion algorithm to find the optimal path through the
cities based on a set of constraints. List the countries and cities you want to
see and their relative weight to get a recommended schedule. A summary card
displays details about the trip. You can copy a link to the schedule to save it
for later.

<img src="https://raw.githubusercontent.com/agale123/world-cup-2023/master/images/itinerary.jpg" width="500px">