[![Silent Space](teaser.png)](https://silent-space.vercel.app)

# Silent Space - Experimental space shooter

Atmospheric and experimental 2D game concept.

- [About](#about)
- [Setup](#setup)
- [Credits](#credits)
- [Contributors](#contributors)
- [Todo](#todo)

<br>

---

[![Quality Gate status](https://sonarcloud.io/api/project_badges/measure?project=ChristianOellers_Silent-Space&metric=alert_status)](https://sonarcloud.io/dashboard?id=ChristianOellers_Silent-Space)
<br><br>

## About

A proof of concept about what can be done with plain Canvas, JavaScript and a bit of auditory and visual trickery.

It's been intended to be somewhat 'arcade-ish', but with a more decent pace and visual focus.

### Compatibility

- Browser with Canvas 2D API support
- Desktop PC with min. 800px screen width
- Decent computing/ graphics power (can be resource intense)
- Mouse, keyboard, audio output

### Playing

There are no goals or enemies yet, but a score for your numeric needs.

- Every game start (or reload) generates a different background ambiente, music, and slight ship settings
- Weapon can change randomly on hit (sth. out of screen ;)
- Difficulty increases over time and affects e.g. particle speed
- Being hit by particle is seemingly unpleasant, and a different experience with or without shield

### History

- 2013: Project start, concepts and mostly graphics. Received few random updates over later years.
- 2020: I decided to start rebuilding it with current technologies and skills, but it's quite a process!
- 2023: Rebuild all graphics, new game mechanics, audio, win/lose conditions, additional Fx.

#### 2013 version

- [Play »](https://christianoellers.github.io/Silent-Space)
- [See code »](https://github.com/ChristianOellers/Silent-Space/tree/gh-pages)

<br>

---

<br>

## Setup

If used locally: You might need a local web server due to potential cross-origin restrictions with some of the files.

- Install Node.js and the project dependencies
- Run `npm run start` to start a local webserver

<br>

---

<br>

---

<br>

## Credits

### Contributors

Thanks for all the support, help and creative feedback!

- Danny N. Grübl

### Audio files

| Type  | Category       | Source      | License                                                      | Content ID                                                        | Author + Website                                                                                              |
| ----- | -------------- | ----------- | ------------------------------------------------------------ | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Sound | Engine         | freesound   | [CC BY 3.0](https://creativecommons.org/licenses/by/3.0)     | [159012](https://freesound.org/people/MortisBlack/sounds/159012)  | [primeval_polypod](https://freesound.org/people/primeval_polypod)                                             |
| Sound | Explosion      | freesound   | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0) | [147583](https://freesound.org/people/CaCtUs2003/sounds/147583)   | [CaCtUs2003](https://freesound.org/people/CaCtUs2003)                                                         |
| Sound | Explosion      | freesound   | [CC BY 3.0](https://creativecommons.org/licenses/by/3.0)     | [108640](https://freesound.org/people/juskiddink/sounds/108640)   | [juskiddink](https://freesound.org/people/juskiddink)                                                         |
| Sound | Laser          | freesound   | [CC BY 3.0](https://creativecommons.org/licenses/by/3.0)     | [151020](https://freesound.org/people/bubaproducer/sounds/151020) | [bubaproducer](https://freesound.org/people/bubaproducer) <br> [Antisample](https://antisample.com)           |
| Sound | Shield Enabled | freesound   | [CC BY 3.0](https://creativecommons.org/licenses/by/3.0)     | [385051](https://freesound.org/people/MortisBlack/sounds/385051)  | [MortisBlack](https://freesound.org/people/MortisBlack) <br> [SoundCloud](https://soundcloud.com/mortisblack) |
| Music | Ambient        | Danny Grübl | © Copyright                                                  | DG-Space-Ambient                                                  | [hans-sperling](https://github.com/hans-sperling)                                                             |

Some sounds have been edited.

<br>

---

<br>

## Todo

### Priority

- Add GitHub link (if viewed via Vercel)
- Update background images to be brighter, nebula, interesting
- Add win/lose condition and end screen
  - e.g. be hit max. 3x (lifes)
- Particles: Can multiple items be quickfixed hacked into?
- Implement Hotkeys for weapons - 1,2
- Implement Mouse click left/right steers like left/right (split screen)
- Fade music from A to B (dramatic sometimes, e.g. 25% chance, never at start)

### Experimental

- Foreground DOM object (display, stereo)
  - Animated by JS, moves/scrolls over screen
  - With SVG mask
  - With Canvas blend-mode OR background-blend

### Cleanup

- Integrate event library
