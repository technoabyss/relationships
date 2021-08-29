import ForceGraph3D from "3d-force-graph";
import SpriteText from "three-spritetext";
import { Optional } from "typescript-optional";

import "normalize.css";
import "./style.sass";

interface FNode { id: string }

const throw_missing_elem = (elem: string): (() => Error) =>
  () => new Error(`The element ${elem} wasn't found`);

const graph_elem = Optional.ofNullable(document.getElementById("graph"))
  .orElseThrow(throw_missing_elem("#graph")) as HTMLDivElement;
const pair_list = Optional.ofNullable(document.getElementById("pairs"))
  .orElseThrow(throw_missing_elem("#pairs")) as HTMLUListElement;
const pair_ui = Optional.ofNullable(document.getElementsByClassName("pair")[0])
  .orElseThrow(throw_missing_elem(".pair")).cloneNode(true) as HTMLLIElement;
const import_input = Optional.ofNullable(document.getElementById("import"))
  .orElseThrow(throw_missing_elem("#input")) as HTMLTextAreaElement;

const Graph = ForceGraph3D({ controlType: "orbit" })(graph_elem)
  .nodeThreeObject(node => {
    const sprite = new SpriteText(node.id as string);
    sprite.color = "#ffffff";
    sprite.textHeight = 6;
    return sprite;
  })
  .nodeOpacity(1)
  .linkColor("#aaaaaa")
  .linkOpacity(1)
  .cameraPosition({ z: 300 })
  .enableNodeDrag(true)
  .enableNavigationControls(true)
  .showNavInfo(true);

// Clear previous values
// This is necessary because of browser autofill
(document.querySelectorAll(".pair > input") as NodeListOf<HTMLInputElement>)
  .forEach(e => e.value = "");
import_input.value = "";

let pairs_export = "";

const listen_inputs = (pair: HTMLLIElement) => {
  // Select the two <input>s
  Array.from(pair.children).slice(0, -1)
    // For each of them, add an event listener so that when anything changes,
    .forEach(input => (input).addEventListener("input", () => {
      // Stop if there's nothing in the input.
      if ((input as HTMLInputElement).value.length === 0) return;

      // Find out what # pair we are,
      let
        i = 1,
        child = pair;
      while ((child = (child.previousElementSibling as HTMLLIElement)) !== null) i++;

      // Stop if there's more pairs past this one.
      if (pair_list.children.length > i) return;

      // Add another pair to the list
      const new_pair: HTMLLIElement = pair_list.appendChild(pair_ui.cloneNode(true)) as HTMLLIElement;

      // And set up event listeners for it
      listen_inputs(new_pair);
    }));

  // Set the X button to delete the entry
  pair.children[2]
        .addEventListener("click", () => {
          // Find out what # pair we're in,
          let
            i = 1,
            child = pair;
          while ((child = (child.previousElementSibling as HTMLLIElement)) !== null) i++;

          // Don't do it if this is the last one and it's empty
          if (
            pair_list.children.length === i &&
        (pair.children[0] as HTMLInputElement).value.length === 0 &&
        (pair.children[1] as HTMLInputElement).value.length === 0
          ) return;

          // Do it
      pair_list.removeChild(pair);
        });
};

// Set the initial pair to listen
listen_inputs(pair_list.children[0] as HTMLLIElement);

const get_pairs = (): string[][] => {
  return Array.from(pair_list.children)
    // Map to [first, second] names
    .map(e => {
      const a = Optional.ofNullable(e.firstElementChild)
        .orElseThrow(() => new Error("Missing first input.")) as HTMLInputElement;
      const b = Optional.ofNullable(a.nextElementSibling)
        .orElseThrow(() => new Error("Missing second input.")) as HTMLInputElement;

      return [a.value.trim(), b.value.trim()];
    })
    // Remove entries where any of the names are empty
    .filter(e => e[0].length > 0 && e[1].length > 0);
};

// Get starting state
let previous_pairs = JSON.stringify(get_pairs());

const update_graph_and_export = (pairs: string[][]) => {
  // Check if there's been any changes, stop if not
  const new_pairs = JSON.stringify(get_pairs().map(e => e.sort()));
  if (new_pairs === previous_pairs) return;

  // Update values
  previous_pairs = new_pairs;
  pairs_export = new_pairs;

  // Graph updated data
  Graph.graphData({
    "nodes": Array.from(new Set(pairs.flat())).map((id: string): FNode => ({ id })),
    "links": pairs.map(e => ({ source: e[0], target: e[1] }))
  });
};

// Check for changes every second
setInterval(() => update_graph_and_export(get_pairs()), 1000);

// Export to clipboard
Optional.ofNullable(document.getElementById("export"))
  .orElseThrow(throw_missing_elem("export"))
  .addEventListener("click", async () => {
    if (pairs_export.length === 0) return;
    await navigator.clipboard.writeText(pairs_export);
  });

Optional.ofNullable(document.getElementById("import_btn"))
  .orElseThrow(throw_missing_elem("import_btn"))
  .addEventListener("click", () => {
    let new_pairs;
    try {
      new_pairs = JSON.parse(import_input.value);
    } catch (e) { return; }

    // Remove all children
    pair_list.textContent = "";

    // Create new pairs
    new_pairs.forEach((e: string[]) => {
      const new_pair = pair_list.appendChild(pair_ui.cloneNode(true)) as HTMLLIElement;
      listen_inputs(new_pair);
      (new_pair.children[0] as HTMLInputElement).value = e[0];
      (new_pair.children[1] as HTMLInputElement).value = e[1];
    });

    // Add an empty pair
    const new_pair: HTMLLIElement = pair_list.appendChild(pair_ui.cloneNode(true)) as HTMLLIElement;

    // And set up event listeners for it
    listen_inputs(new_pair);

    // Empty import textarea
    import_input.value = "";
  });
