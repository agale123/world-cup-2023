# User Study #1

- [x] Would be helpful to show the country associated with the city
- [x] Distinguish group stage from knockout rounds in the schedule
- [x] Pick New Zealand: 1 and then change to New Zealand: 2 with a
New Zealand filter then it shows some rows that don't have New
Zealand.
- [x] Add ? tooltip that explains what it shows
- [x] Horizontal border between 4 sections on the schedule page
- [x] Change Save text to be something like "Add projection"

- [x] Can you add flag emojis to the country names?
- [x] Insecure d3 script warning
- [x] Generate itinerary is broken

# User Study #2

- [x] Maybe use "My timezone" for computer time
- [x] Add countries to the timezone picker
- [x] Make projection tooltip clarify that you can do more than one team
- [x] Make a column that shows round (group, semi, final, etc)
- [x] For map page, use wording about win group stage and second in group
- [x] For map, don't show country on labels
- [x] Is it further or farther

# Bugs

- [x] Some cities appear to be missing on the map on the itinerary or extra
ones are showing
- [x] If you pick all Australia cities, the itinerary sometimes has a
bunch of New Zealand cities
- [x] If you select a city and a team, it weights the team more heavily

# Other Ideas

- [x] Incorporate both versions of the city names in tooltips
- [x] Update link for the schedule page to have projections and filters
- [x] Add query params to the link as you change them
- [x] Simplify itinerary planner algorithm to just look at cities/teams of
  interest and find the best path through. For example, just grab only games
  that include teams and cities specified and find the optimal path through
  those. Then if there are any games that can be added (based on gap between
  games and how out of the way the extra games are) then they are included.

# Polish

- [x] Add facts for all countries
- [x] Add flags for all countries
- [ ] Add game times
- [ ] Add updated FIFA reankings
- [x] Tune itinerary parameters
- [x] Ensure site previews well on social media