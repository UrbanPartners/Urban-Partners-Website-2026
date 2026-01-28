## Getting Started

Make sure you've added a `.env.local` file containing the necessary env vars to this directory to ensure you can do the following successfully:

1. Ensure you've installed [nvm](https://github.com/nvm-sh/nvm)
2. Run `nvm use` to ensure you're on the appropriate node version
3. Run `npm i` to install dependencies
4. Run the dev server: `npm run dev`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Generating Page Sections

1. Go to the root of this repo (`cd ..`)
2. Ensure you have [Hygen](https://www.hygen.io/) installed
3. Figure out what the snake_case version of the page section is you want to create. Ie. if you are building a page section named `Title and Text`, the snake_cased version would be `title_and_text`
4. Run `hygen section new section_name` where `section_name` is the name of your page section. So using the above as an example, you would run `hygen section new title_and_text`
5. This generates all files and injects code into the `/nextjs` and `/sanity` directories where necessary
