## AI Tools Usage

I find that AI tools not only allow for increased productivity and fast ideation, but also allow me to learn at faster rates while maintaining a hands on approach. While it can speed up development, I make sure to take my time in the right places to fully understand what has been generated and comprehend code to further my own skills.

### Code Generation and Boilerplate

- **Tool**: Claude Code
- **Task**: Boiler plate code generation - express + typescript initialization with endpoints
- **Time Saved**: ~20 minutes
- **Notes**: needed to manually configure `tsconfig.json` and `package.json` to allow ESM imports and scripts to run (e.g. --loader for ts-node to work properly with ES modules)
- **Example prompts**:
  - "initialize an express app in the backend directory using typescript. Just create a basic template server using src dir"
  - "observe the training data and create basic types/interfaces alongside an /api/insights endpoint. @backend/training-data.json"

  ### Code Generation and Boilerplate

- **Tool**: Claude Code
- **Task**: Boiler plate code generation - Vue app and dashboard template
- **Time Saved**: ~30 minutes
- **Notes**: easily created a basic template/skeleton dashboard for me to have a better starting point for my dashboard
- **Example prompts**:
  - "remove the example vue app and create a boiler plate template for a dashboard. Create basic containers for components. I want a clean design with a header at the top,followed by some quick info cards, followed by the main grid of charts"

  ### Code Completion - Rapid Charts Template Generation

- **Tool**: Claude Code
- **Task**: Create a chart based on provided data structure and available insights composable
- **Time Saved**: >=20mins per chart -> more than 1hr total
- **notes**: previous context of codebase allowed chart generation in new component to slot right into place.
- **Example prompts**:
  - "Using chartjs, create a basic line chart showcasing trends over time. For now, we only have the
    averageScore per date, so plot averageScore against time. It should be pretty and interactive"
  - "i want you to create a radar chart to compare the skills across departments. each department should be its own dataset and get its own colour, and the labels should be the skills themselves. Make it pretty and interactive/animated where possible. Observe the data types we expect to receive in the
    composable @frontend/src/composables/useInsights.ts @frontend/src/types/api.ts
    @frontend/src/components/DashboardLayout.vue
    make sure to type appropriately again"

### Code Completion

- **Tool**: GitHub Copilot autocompletion
- **Task**: Generic auto completion and suggestions to speed up development and documentation/comments

### Type Creation and Consistency

- **Tool**: Claude Code
- **Task**: Quickly generate types in frontend based on the already completed backend endpoint.
- **Time Saved**: ~ 10mins

### Problem Solving & Debugging 

- **Tool**: Claude Code
- **Task**: Fixed dashboard/charts re-rendering flash issue affecting entire page
- **Time Saved**: ~30 minutes
- **Prompt**: "When I apply filters the whole page has a quick refresh and it's noticeable as a quick flash across the whole dashboard"
- **Solution**: Was conditionally rendering the entire dashboard layout with isLoading states, moved loading states to appropriate/necessary components only. Now only data dependent components reload on filter changes.

### Refactoring / Clean Up / Organization
- **Tool**: Claude Code
- **Task 1**: Remove hard coded departments throughout the app, make dynamic
- **Time Saved**: ~30 minutes
- **Prompt**: I have hardcoded departments throughout the frontend and backend. Please remove the hardcoded departments and make them dynamic, so we can accommodate changes in data. Assume the skill sets stay the same, so skills can remain hardcoded for now.
- **Notes**: worked pretty well first try but some department colours in the COLOR_PALETTE were too similar. Searched online for more diverse colour array (found very quickly) and updated manually. 

- **Task 2**: Create shared styles/config for the charts to reuse
- **Time Saved**: ~30 minutes
- **Prompt**: extract the similar/common styles and config for each of the 3 charts and create utility files for these. Ensure chart styling and configuration is consistent, add any unique config to charts individually when necessary.
- **Notes**: worked well, added/updated styling and configuration manually as and when needed (e.g. chart specific styling, slightly varied legend config etc.) 


### Data generation

- **Tool**: Claude
- **Task**: Create larger dataset
- **Time Saved**: ~30-45mins
- **Prompt**: @backend/training-data.json i want you to create a new training-data-large.json
  use the same data points that exist but add more sessions for a total of 50. Ensure sessionIds
  increment just like the existing data does. add dates as appropriate. Add a few more departments -
  should have 5 total. Keep the same 4 skillsets in the range of 0-100. For skill scores,
  completionTime and passed, use some randomness but not completely arbitrary, they should be
  realistic and you can create some kinds of trends (some trends between or within deparments,
  skills, passrates, completiontimes etc.) Some outliers are allowed to create talking points as
  anomalies.
  Overall score should be the average of the 4 skill scores, rounded to the nearest integer.

  I also want users to repeat the training. So i'm thinking 25 unique users, each take the training
  twice, the second time around is roughly 3 months later (next quarter). 25 unique users, 2
  sessions each total = 50 sessions all up. 5 departments = roughly 5 users per department, but can
  have 1 or 2 either side of this so long as we end with 5 departments and 25 users. ensure userId
  and userName and department are consistent for unique users
