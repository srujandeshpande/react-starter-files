import fs from "fs";
import clear from "clear";
import inquirer from "inquirer";

import { routesTemplate, componentTemplate, appTemplate } from '../../templates';
import { Intro } from "../../utils/interactiveOutputs";

const createFolder = (path) => {
  fs.mkdirSync(process.cwd() + "/src" + path, { recursive: true }, (error) => {
    if (error) {
      console.error("ERROR OCCURED:", error);
      return false;
    } else {
      return true;
    }
  });
};

const createAppFile = (pages) => {
    fs.writeFile(
        process.cwd() + `/src/App.js`,
        appTemplate(pages),
        (error) => {
        if (error) {
            console.log("ERROR OCCURED:", error);
            return false;
        } else {
            return true;
        }
        }
  );
}

const createComponentFile = (component) => {
  fs.writeFile(
    process.cwd() + `/src/components/${component}.js`,
    componentTemplate(component),
    (error) => {
      if (error) {
        console.log("ERROR OCCURED:", error);
        return false;
      } else {
        return true;
      }
    }
  );
};

const createPageFile = ({ component }) => {
  fs.writeFile(
    process.cwd() + `/src/pages/${component}.js`,
    componentTemplate(component),
    (error) => {
      if (error) {
        console.log("ERROR OCCURED:", error);
        return false;
      } else {
        return true;
      }
    }
  );
};

const createRouteFile = (pages) => {
  console.log("HEREEE");
  fs.writeFile(
    process.cwd() + `/src/routes/index.js`,
    routesTemplate(pages),
    (error) => {
      if (error) {
        console.log("ERROR OCCURED:", error);
        return false;
      } else {
        return true;
      }
    }
  );
};

const init = async (showIntro = true) => {
  clear();
  if (showIntro) Intro();
  /*
    const pages = [
        {
            name: "home",
            component:"Home",
            route:"/home"
        },
        {
            name: "info",
            component:"Info",
            route:"/info"
        }
    ];
    
    const components = ["Navbar", "ProjectCard"];
*/

  const pages = [];
  const components = [];

  let flag = 1;
  console.log("\n");

  let answer, answers;

  answer = await inquirer.prompt([
    {
      name: "check",
      message: "Do you want to create pages? (y/n)",
    },
  ]);
  let check = answer.check.toLowerCase();
  if (check === "y" || check === "yes") {
    flag = 1;
  } else if (check === "n" || check === "no") {
    flag = 0;
  } else {
    console.log("Couldn't understand you, answer with y/n only :( \n");
    return;
  }

  while (flag) {
    console.log("\n");
    answers = await inquirer.prompt([
      {
        name: "page",
        message: "Name the page component:",
      },
      {
        name: "route",
        message: "Which route should it point to:",
      },
    ]);

    try {
      if (answers.page === "*qa" || answers.route === "*qa") {
        flag = 0;
        continue;
      } else if (answers.page === "" || answers.route === "") {
        console.error("Either page or route is in the wrong format!\n");
      } else {
        const page = {
          name: answers.page.toLowerCase(),
          component: answers.page,
          route: answers.route,
        };
        pages.push(page);
      }
    } catch (err) {
      console.log("ERROR", err);
    }
  }

  console.log("\n");
  answer = await inquirer.prompt([
    {
      name: "check",
      message: "Do you want to create components? (y/n)",
    },
  ]);

  check = answer.check.toLowerCase();

  if (check === "y" || check === "yes") {
    flag = 1;
  } else if (check === "n" || check === "no") {
    flag = 0;
  } else {
    console.log("Couldn't understand you, answer with y/n only :( \n");
    return;
  }

  while (flag) {
    console.log("\n");
    answers = await inquirer.prompt([
      {
        name: "component",
        message: "Name the component:",
      },
    ]);
    try {
      if (answers.component === "*qa") {
        flag = 0;
        continue;
      } else if (answers.component === "") {
        console.error("Component is in the wrong format!\n");
      } else {
        components.push(answers.component);
      }
    } catch (err) {
      console.log("ERROR", err);
    }
  }

  console.info("\n Creating files..");

  createFolder("/pages");
  pages.forEach((page) => createPageFile(page));

  createFolder("/routes");
  createRouteFile(pages);

  createFolder("/components");
  components.forEach((component) => createComponentFile(component));

  createAppFile(pages);

  console.info("\n✅ Done");
};

export default init;
