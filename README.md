A-Maze
======

This JavaScript project is a POC (Proof Of Concept) showing the use of the
following technologies:

- promises,
- canvas,
- HTML import,
- HTML template,
- custom elements

It requires a browser supporting these technologies in order to run.

The main program is `maze-app.html`. The web component is contained in
`a-maze.html` and defines the `a-maze` custom tag.

The project uses a tile sheet from the "Simplified Platformer Pack" from
Kenney Vleugels (Kenney.nl).

Run
---

Go to [index.html](index.html)

Creating your own maze
----------------------

Mazes are created using [Tiled, a level editor](https://www.mapeditor.org/).

### The map

The map must use the **JSON format** produced by Tiled.

The map **must have** thses custom properties:

- `darkness`: bool, true if the map starts in the dark, false otherwise.
- `startx`, `starty`: int, coordinates at which the player starts the adventure.
- `herosprite`: int, the id of the sprite representing the player.

### Layers

There **must be** 3 layers, from top to bottom, named exactly:

- `objects`: an object layer, the complete list of interactive objects in the
  game, see the next section for more information.
- `walls`: a tile layer, the walls cannot be crossed, any other cell must be
  left empty (transparent) to allow the player to move.
- `decor`: a tile layer, completely decorative, it allows to draw more elaborate
  level design.
- `background`: a tile layer, the background is only decorative, it plays
  absolutely no role in the game.

### Objects

Objects are contained in an object layer.

They **must use** tile objects.

They **must be** placed at tile boundaries. In the Tiled editor, this is done by
using the `ctrl` key while placing the object.

They **must have** a name. This name may use spaces and may be displayed when
messages pop up.

Each object may have an **actions** custom property.

The **actions** custom property is a list of actions to execute when the object
is hit by the hero.

The **actions** custom property looks like this:

    sound("metal-clinging.mp3");
    win("Congratulations", "You win!", "Go to the next level!");

Here are the actions understood by the game engine:

- `question`: generally represented by a guardian. If the player gives the
  right answer, the guardian disappears.
- `secret`: generally represented by a book. It gives some useful information
  to the player.
- `teleport`: it literally teleports the player to another position in the map.
- `edible`: food that increases player health.
- `inedible`: food that decreases player health.
- `weapon`: increases the player strength.
- `protection`: increases the player resistance.
- `show`: make another object visible.
- `hide`: make another object invisible.
- `showmap`: reveal the entire map.
- `hidemap`: hide the entire map except around the hero.
- `sound`: plays a sound.
- `treasure`: a treasure.
- `win`: the item the player has to find to end the level.

#### `question`

A `question` takes 6 parameters.

- question (string), the litteral question presented to the player.
- choices (string) the 4 choices.
- answer (string), the position of the right answer ("0", "1", "2" or "3").

#### `secret`

A `secret` takes 3 parameters.

- title (string): a title or an introduction text (ie: "Did you know?")
- subject (string): string, the secret (ie: "The ring is blue")
- description (string): a description (ie: "A guardian may like this")

#### `teleport`

A `teleport` takes 1 parameter:

- destination (int): the id of the object which will receive the player after
  teleportation.

#### `edible`

An `edible` takes 1 parameter:

- health (int): health increase (ie: 10)

#### `inedible`

An `inedible` takes 1 parameter:

- health (int): health decrease (ie: 10)

#### `weapon`

A `weapon` takes 1 parameter:

- attack (int): attack increase (ie: 10)

#### `protection`

A `protection` takes 1 parameter:

- defense (int): defense increase (ie: 10)

#### `show`

A `show` takes 1 or more parameters:

- object (int): the id of the object to show (ie: 10)

#### `hide`

A `hide` takes 1 or more parameters:

- object (int): the id of the object to hide (ie: 10)

#### `treasure`

A `treasure` takes 1 parameter:

- treasure (int): increase the wealthness (ie: 10)

#### `win`

A `win` takes 3 parameters:

- title (string): a title or an introduction text (ie: "Did you know?")
- subject (string): string, the secret (ie: "The ring is blue")
- description (string): a description (ie: "A guardian may like this")
