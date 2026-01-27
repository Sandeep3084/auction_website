# codebase Analysis Report

## Project Overview
This project is a React-based web application titled **"Character Auction"**. It allows users to browse a catalog of anime characters, view their statistics, and assign them to different teams. The application also provides an aggregated view of team statistics.

## Technology Stack
- **Framework**: React 19 (using Vite as the build tool)
- **Styling**: Tailwind CSS 4
- **Data Parsing**: PapaParse (for CSV processing)
- **Package Manager**: NPM (likely, based on package.json, though bun.lock is present indicating Bun might be used as well)

## Data Source
The application relies on a CSV file named `chars.csv` located in the public directory. This file contains the following data points for each character:
- **NAME**: Character Name
- **STRENGTH**: Strength Rating
- **STAMINA**: Stamina Rating
- **DEXTERITY**: Dexterity Rating
- **INTELLIGENCE**: Intelligence Rating
- **MAGIC**: Magic Rating
- **ANIME**: Source Anime
- **avg star rating**: User Rating

## Component Architecture

### 1. `App.jsx`
The entry point of the application. It sets up the main layout container and renders the `CharacterAuction` component.

### 2. `CharacterAuction.jsx` (Main Container)
This is the core logic container.
- **State Management**:
  - `characters`: Stores the parsed data from `chars.csv`.
  - `teams`: Manages the state of 10 teams (`Team 1` to `Team 10`), each holding a list of assigned cards.
  - `error`: Tracks any data fetching or parsing errors.
- **Data Fetching**: Uses `useEffect` to fetch and parse `chars.csv` on component mount.
- **Actions**: Provides the `assignToTeam` function to add characters to a specific team array.

### 3. `Tabs.jsx`
Handles the high-level view switching.
- **Views**:
  - **Catalog**: Browsing the character list.
  - **Team Stats**: Viewing the total stats for each team.

### 4. `Catalog.jsx` & `Pagination.jsx`
responsible for displaying the character grid.
- **Pagination**: Limits the view to 5 characters per page.
- **Grid Layout**: Responsive grid (1 column on mobile, 2 on small screens, 3 on large screens).

### 5. `Card.jsx`
The individual character display component.
- **Visuals**: Displays the character image (loaded dynamically from `/images/[name].webp`) or a default placeholder.
- **Interactions**:
  - **Hover**: Shows character name and details.
  - **Team Selection**: A dropdown to assign the character to one of the 10 teams.
  - **Stats Toggle**: A button to show/hide detailed numerical usage (Strength, Stamina, etc.).

### 6. `Stats.jsx`
Visualizes the performance of the teams.
- **Calculation**: Aggregates the total stats (Strength, Stamina, etc.) for all characters currently assigned to each team.
- **Display**: Renders a card for each team showing these summed values.

## Key Features
1.  **Dynamic Data Loading**: The app is data-driven, rendering content directly from a CSV file.
2.  **Team Management**: Users can build teams by selecting characters from the catalog.
3.  **Real-time Stats Aggregation**: As characters are added to teams, the "Team Stats" view automatically updates with the cumulative power ratings.
4.  **Responsive Design**: The UI adapts to different screen sizes using Tailwind CSS.

