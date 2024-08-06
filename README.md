# Simple Sudoku Game On/Offline

![Render](https://img.shields.io/badge/Render-%46E3B7.svg?style=for-the-badge&logo=render&logoColor=white)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Google Play](https://img.shields.io/badge/Google_Play-414141?style=for-the-badge&logo=google-play&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)

This is a pretty simple sudoku game that offers two fill game modes: 
- **Auto Fill**: A sudoku generator with different
levels of difficulty
- **Manual Fill**: Offers the possibility to insert sudokus. 

It's available via **Web**, **instalable platform-independent PWA**
and on **Google Play Store**.

It's made with vanilla **HTML**/**CSS**/**JS**!!!

It's intended to be playable completely **offline**  in must devices/SO.

## 📖 Main Functionalities 
- [x] Different Fill Options
  - [x] Automatic Fill with different levels of difficulty
  - [x] Manual Fill
- [x] Validate that Manual Fill entered sudokus must be [human solvable](https://www.technologyreview.com/2012/01/06/188520/mathematicians-solve-minimum-sudoku-problem/).
- [x] Deploy on Render
- [x] Make it a Progressive Web App
- [ ] Make it available on Google Play Store
- [ ] Make it available on Microsoft Store
- [x] Add chronometer to game
- [x] Add confetti and vibration to winning modal
- [ ] Add assistance
  - [ ] Add completed numbers guidance
  - [ ] Add possible numbers guidance interface
- [ ] Internationalization
- [ ] Language auto detection

## 🛠️ How it works?
### 🤖 Auto Fill
This fill mode uses a fast sudoku puzzle algorithm. It's a seed transformación algorithm  based on [sudoku-gen](https://github.com/petewritescode/sudoku-gen).

#### 📜 Explanation
Most sudoku generators start with a completed sudoku grid and remove numbers one at a time, using a backtracking algorithm to stop once the puzzle becomes unsolvable. This process is too slow to be performed in real-time, so usually requires a background task and database for generating and storing puzzles as they're created. That's only to create a puzzle... Besides that, The generales puzzle must be graded, which is more complicated than the generación.

The used algorithm works differently. It starts with a known, solvable "seed" puzzle and performs various transformations to turn it into a brand new puzzle. This makes it extremely fast, with no requirement for a back end, whilst maintaining quality.

Each seed gives over 2.4 trillion unique puzzles. To put that in context, if you played sudoku 24/7 and took 3 minutes to solve each puzzle, it would take until your 13,915,534th birthday to exhaust a single seed 🎂.

##### 🔮 Transformations
The following transformations are used ("!" = factorial):

- **Rotate board:** **4** permutations (0°, 90°, 180°, 270°).
- **Shuffle column groups ("stacks"):** **6** permutations (3!).
- **Shuffle row groups ("bands"):** **6** permutations (3!).
- **Shuffle columns: 216** permutations (3! x 3! x 3!).
- **Shuffle rows: 216** permutations (3! x 3! x 3!).
- **Swap numbers: 362,880** permutations (9!).

**Total permutations per seed** = 4 x 6 x 6 x 216 x 216 x 362,880 = **2,437,996,216,320.**

##### 🌱 Seeds by level of difficulty
The amount of seed by level of difficulty are describes :
- **Easy**: X
- **Medium**: Y
- **Hard**: Z
- **Expert**: A



### 👾 Manual Fill


## 🏛️ Dependencies
- [Sweet Alert 2](https://sweetalert2.github.io/)
- [Font Awesome](https://fontawesome.com/)
- [Ts Particles Confetti](https://confetti.js.org/#)

## 🚀 Deploy on Render
The web application is statically deploy on [Render](https://sudoku-play.onrender.com)

## 📸 Screenshots

## 😎 Progressive Web App
> [!WARNING] 
> Firefox Desktop/Mobile is not PWA ready... They aren't cool 🫤


## ▶️ Google Play Store
Google Play Store offers the possibility to...



