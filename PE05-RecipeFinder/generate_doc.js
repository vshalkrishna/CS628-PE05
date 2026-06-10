const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType,
  LevelFormat, PageNumber, Footer, TabStopType, TabStopPosition,
  Header
} = require("docx");
const fs = require("fs");
const path = require("path");

// ── helpers ────────────────────────────────────────────────────────────────
const h1 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_1,
  children: [new TextRun({ text, bold: true, size: 32, color: "C04C1A" })]
});
const h2 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_2,
  children: [new TextRun({ text, bold: true, size: 26, color: "2E7D52" })]
});
const h3 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_3,
  children: [new TextRun({ text, bold: true, size: 22, color: "1A5276" })]
});
const body = (text, opts = {}) => new Paragraph({
  children: [new TextRun({ text, size: 20, ...opts })]
});
const blank = () => new Paragraph({ children: [new TextRun("")] });

// Code block paragraph factory
const codeLine = (text) => new Paragraph({
  children: [new TextRun({ text, font: "Courier New", size: 16, color: "1A1A2E" })],
  indent: { left: 360 },
  shading: { type: ShadingType.CLEAR, fill: "F4F6F7" },
  spacing: { before: 0, after: 0, line: 240 },
});

// Multi-line code block from a string
const codeBlock = (code) => {
  const lines = code.split("\n");
  return lines.map(line => codeLine(line));
};

// Bullet item
const bullet = (text) => new Paragraph({
  numbering: { reference: "bullets", level: 0 },
  children: [new TextRun({ text, size: 20 })],
});

// Section divider
const divider = () => new Paragraph({
  border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "E07B39", space: 1 } },
  children: [new TextRun("")],
  spacing: { after: 120 },
});

// ── File contents ──────────────────────────────────────────────────────────
const baseDir = "/home/claude/recipe-finder";

const readFile = (rel) => {
  try { return fs.readFileSync(path.join(baseDir, rel), "utf8"); }
  catch { return `// [File not found: ${rel}]`; }
};

// ── Document ───────────────────────────────────────────────────────────────
const doc = new Document({
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: "•",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }]
      }
    ]
  },
  styles: {
    default: { document: { run: { font: "Calibri", size: 20 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run:  { size: 32, bold: true, font: "Calibri", color: "C04C1A" },
        paragraph: { spacing: { before: 300, after: 120 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run:  { size: 26, bold: true, font: "Calibri", color: "2E7D52" },
        paragraph: { spacing: { before: 240, after: 80 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run:  { size: 22, bold: true, font: "Calibri", color: "1A5276" },
        paragraph: { spacing: { before: 200, after: 60 }, outlineLevel: 2 } },
    ]
  },
  sections: [{
    properties: {
      page: {
        size:   { width: 12240, height: 15840 },
        margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 }
      }
    },
    headers: {
      default: new Header({
        children: [
          new Paragraph({
            children: [
              new TextRun({ text: "CS628 PE05 – Recipe Finder", bold: true, size: 18, color: "7F8C8D" })
            ],
            alignment: AlignmentType.RIGHT,
            border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "E07B39" } }
          })
        ]
      })
    },
    footers: {
      default: new Footer({
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: "Page ", size: 16, color: "95A5A6" }),
              new TextRun({ children: [PageNumber.CURRENT], size: 16, color: "95A5A6" }),
              new TextRun({ text: " of ", size: 16, color: "95A5A6" }),
              new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16, color: "95A5A6" }),
            ]
          })
        ]
      })
    },
    children: [
      // ═══ TITLE PAGE ═══════════════════════════════════════════════════════
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 480, after: 120 },
        children: [new TextRun({ text: "🍴 Recipe Finder", bold: true, size: 56, color: "E07B39", font: "Calibri" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
        children: [new TextRun({ text: "CS628 Full-Stack Development – PE05", size: 24, color: "5D6D7E" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
        children: [new TextRun({ text: "School of Technology & Computing (STC)", size: 22, color: "7F8C8D" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 480 },
        children: [new TextRun({ text: "City University of Seattle (CityU)", size: 22, color: "7F8C8D" })]
      }),
      divider(),
      blank(),

      // ═══ OVERVIEW ═════════════════════════════════════════════════════════
      h1("1. Application Overview"),
      body("Recipe Finder is a full-stack web application that allows users to discover and manage recipes. Built with React on the frontend and Node.js + Express + MongoDB Atlas on the backend, it demonstrates full CRUD operations, React Router nested routes, and the useParams hook."),
      blank(),

      h2("1.1 Tech Stack"),
      bullet("Frontend: React 18, React Router v6"),
      bullet("Backend: Node.js, Express 4"),
      bullet("Database: MongoDB Atlas (MongoDB Node.js driver)"),
      bullet("Styling: Custom CSS with CSS variables"),
      blank(),

      h2("1.2 Features"),
      bullet("Recipe List – Browse all recipes in a searchable, scrollable sidebar"),
      bullet("Recipe Detail – Nested route showing full recipe details using useParams"),
      bullet("Add Recipe – Form to create a new recipe (name, ingredients, instructions, etc.)"),
      bullet("Edit Recipe – Pre-filled form to update any recipe"),
      bullet("Delete Recipe – Delete from both the sidebar and detail view"),
      blank(),

      // ═══ PROJECT STRUCTURE ════════════════════════════════════════════════
      h1("2. Project Structure"),
      ...codeBlock(
`PE05-Recipe Finder/
├── backend/
│   ├── server.js          # Express server + MongoDB CRUD routes
│   ├── package.json
│   └── .env.example       # MongoDB URI template
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── App.js          # Router setup (all routes)
    │   ├── index.js
    │   ├── index.css       # Global styles
    │   ├── App.css
    │   ├── components/
    │   │   ├── Navbar.js   # Navigation bar
    │   │   ├── Navbar.css
    │   │   ├── RecipeForm.js  # Shared add/edit form
    │   │   └── RecipeForm.css
    │   └── pages/
    │       ├── Home.js         # Landing page
    │       ├── RecipeList.js   # Route + Outlet for nested detail
    │       ├── RecipeDetail.js # Nested detail using useParams
    │       ├── AddRecipe.js    # Add new recipe
    │       └── EditRecipe.js   # Edit existing recipe
    └── package.json`
      ),
      blank(),

      // ═══ BACKEND ══════════════════════════════════════════════════════════
      h1("3. Backend – server.js"),
      body("The Express server connects to MongoDB Atlas and exposes five REST endpoints for recipe CRUD operations."),
      blank(),
      ...codeBlock(readFile("backend/server.js")),
      blank(),

      // ═══ FRONTEND ═════════════════════════════════════════════════════════
      h1("4. Frontend Source Files"),

      // App.js
      h2("4.1 App.js – React Router Configuration"),
      body("App.js sets up all routes. The /recipes route uses a nested <Route> with Outlet, allowing RecipeDetail to render inside RecipeList."),
      blank(),
      ...codeBlock(readFile("frontend/src/App.js")),
      blank(),

      // Navbar
      h2("4.2 components/Navbar.js"),
      ...codeBlock(readFile("frontend/src/components/Navbar.js")),
      blank(),

      // RecipeList
      h2("4.3 pages/RecipeList.js"),
      body("The RecipeList page fetches all recipes, renders the sidebar list, and provides an <Outlet> for the nested RecipeDetail component. It also handles in-page deletion."),
      blank(),
      ...codeBlock(readFile("frontend/src/pages/RecipeList.js")),
      blank(),

      // RecipeDetail
      h2("4.4 pages/RecipeDetail.js"),
      body("RecipeDetail is rendered inside the RecipeList Outlet. It uses the useParams hook to extract the recipe _id from the URL and fetches the recipe from the API."),
      blank(),
      ...codeBlock(readFile("frontend/src/pages/RecipeDetail.js")),
      blank(),

      // RecipeForm
      h2("4.5 components/RecipeForm.js"),
      body("A reusable controlled form component shared by both AddRecipe and EditRecipe pages."),
      blank(),
      ...codeBlock(readFile("frontend/src/components/RecipeForm.js")),
      blank(),

      // AddRecipe
      h2("4.6 pages/AddRecipe.js"),
      ...codeBlock(readFile("frontend/src/pages/AddRecipe.js")),
      blank(),

      // EditRecipe
      h2("4.7 pages/EditRecipe.js"),
      ...codeBlock(readFile("frontend/src/pages/EditRecipe.js")),
      blank(),

      // Home
      h2("4.8 pages/Home.js"),
      ...codeBlock(readFile("frontend/src/pages/Home.js")),
      blank(),

      // ═══ README ══════════════════════════════════════════════════════════
      h1("5. README.md – Analysis Report (Input–Process–Output)"),
      ...codeBlock(readFile("README.md")),
      blank(),

      // ═══ SETUP INSTRUCTIONS ══════════════════════════════════════════════
      h1("6. Setup & Run Instructions"),

      h2("6.1 MongoDB Atlas"),
      bullet("Create a free cluster at mongodb.com/atlas"),
      bullet("Create a database user with read/write access"),
      bullet("Allow your IP address in Network Access"),
      bullet("Copy the connection string (SRV format)"),
      blank(),

      h2("6.2 Backend Setup"),
      ...codeBlock(
`cd PE05-Recipe\\ Finder/backend
npm install
cp .env.example .env
# Edit .env → paste your MongoDB URI
npm start          # runs on http://localhost:5000`
      ),
      blank(),

      h2("6.3 Frontend Setup"),
      ...codeBlock(
`cd PE05-Recipe\\ Finder/frontend
npm install
npm start          # runs on http://localhost:3000`
      ),
      blank(),

      h2("6.4 API Endpoints"),
      body("All endpoints are prefixed with /api/recipes:"),
      blank(),
      // simple table for endpoints
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [1560, 2340, 5460],
        rows: [
          new TableRow({
            tableHeader: true,
            children: ["Method", "Path", "Description"].map(t =>
              new TableCell({
                shading: { fill: "E07B39", type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                width: { size: t === "Description" ? 5460 : t === "Path" ? 2340 : 1560, type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun({ text: t, bold: true, color: "FFFFFF", size: 18 })] })]
              })
            )
          }),
          ...([
            ["GET",    "/api/recipes",      "Retrieve all recipes"],
            ["GET",    "/api/recipes/:id",  "Retrieve one recipe by ID"],
            ["POST",   "/api/recipes",      "Create a new recipe"],
            ["PUT",    "/api/recipes/:id",  "Update a recipe by ID"],
            ["DELETE", "/api/recipes/:id",  "Delete a recipe by ID"],
          ].map(([m, p, d]) =>
            new TableRow({
              children: [m, p, d].map((t, ci) => {
                const w = ci === 2 ? 5460 : ci === 1 ? 2340 : 1560;
                const color = m === "GET" ? "1A5276" : m === "POST" ? "1E5C3A" : m === "PUT" ? "7D4E00" : "641E16";
                return new TableCell({
                  margins: { top: 80, bottom: 80, left: 120, right: 120 },
                  width: { size: w, type: WidthType.DXA },
                  children: [new Paragraph({ children: [new TextRun({ text: t, size: 18, font: ci === 0 ? "Courier New" : "Calibri", bold: ci === 0, color: ci === 0 ? color : "000000" })] })]
                });
              })
            })
          ))
        ]
      }),
      blank(),
    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("/mnt/user-data/outputs/CS628_PE05_RecipeFinder.docx", buf);
  console.log("Done: CS628_PE05_RecipeFinder.docx");
});
