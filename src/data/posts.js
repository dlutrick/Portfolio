export const POSTS = [
  {
    id: 'why-plotdr',
    title: 'Why I Built PlotDr',
    subtitle: 'Most writing tools treat words like text. PlotDr treats them like a system.',
    category: 'plotdr',
    catLabel: 'PlotDr',
    date: 'May 2025',
    readTime: '6 min read',
    excerpt: "Every novelist hits a wall. Not writer's block. The wall where your story gets too complex to hold in your head.",
    body: `
<h2>The problem every novelist hits</h2>
<p>Every novelist hits a wall. Not writer's block. The wall where the story gets too big to hold in your head. You're 60,000 words into a fantasy novel and you genuinely cannot remember if your protagonist's sister is older or younger. You described a city's marketplace in chapter four and now, in chapter nineteen, you've accidentally placed the blacksmith shop on the wrong street.</p>
<p>These aren't signs of a bad writer. They're signs of a complex story. And the tools most writers use (Word, Google Docs, Scrivener) were built to organize words, not manage <strong>narrative systems</strong>.</p>
<p>That distinction matters. A novel isn't a long document. It's a web of characters, relationships, locations, timelines, and cause-and-effect chains. Managing it like a document is why so many long-form writers eventually drown in their own work.</p>

<h2>What I wanted to build</h2>
<p>I wanted to build a writing environment that understood stories the way a co-author would. Not just storing text, but tracking the characters, what they want, where they've been, what they know, and using all of that to catch inconsistencies before the writer even notices them.</p>
<p>The product I had in my head had two modes. A <strong>writing mode</strong> where you write prose with an AI that knows your full manuscript. And an <strong>architect mode</strong> where you can see the whole story laid out: scenes, acts, character arcs, all at once.</p>
<p>Most importantly, it needed a memory system. Not a flat notes document. A real knowledge base of your story's world, automatically populated as you write and actively consulted when the AI assists you.</p>

<h2>The first version was completely wrong</h2>
<p>My first architecture treated the Codex (the character/world database) as a separate module writers manually updated. You'd write a scene, then go to the Codex and update your character's entries.</p>
<p>Nobody does that. Writers write. They don't want to stop every few paragraphs and update a database. The Codex needed to update itself, watching what got written and pulling out the relevant details automatically.</p>
<p>That pushed me toward a much harder technical problem: <strong>extracting entities from long-form narrative text is genuinely tricky</strong>. Telling a character name from a place name, tracking pronoun references, knowing that "the king" and "Aldric" are the same person. These aren't things you can just hand off to a generic LLM call and call it done.</p>

<h2>What the architecture looks like now</h2>
<p>PlotDr runs on three layers. The <strong>manuscript layer</strong> is the raw text, stored as structured blocks with metadata. The <strong>Codex layer</strong> is a MongoDB document store of story entities (characters, locations, factions, objects) each with their own schema and a list of references back to where they appear in the text. The <strong>Oracle layer</strong> is a background job that compares new writing against the Codex and flags anything that contradicts what's already been established.</p>
<p>The AI writing assistant doesn't just see the current paragraph. Before every completion call, it gets a compressed snapshot of the relevant Codex entries: the characters in the scene, the location, the active plot threads.</p>
    `,
    wrong: {
      title: 'The token budget problem',
      body: "My first context injection strategy was just passing the entire Codex into every completion call. For short manuscripts, fine. Past 30,000 words I was burning through tokens and completions were getting slow. Had to build a relevance scorer to figure out which entries actually mattered for the current scene. Whole extra layer of work I didn't budget for. Lesson: context budgets matter. You can't just throw everything at the model and hope.",
    },
    relatedPosts: ['codex-memory-system', 'ai-memory-experiments'],
  },
  {
    id: 'codex-memory-system',
    title: 'Designing the Codex Memory System',
    subtitle: 'Building a story knowledge graph that populates itself as you write.',
    category: 'plotdr',
    catLabel: 'PlotDr',
    date: 'May 2025',
    readTime: '8 min read',
    excerpt: "The hardest part of building PlotDr wasn't the AI. It was designing a data model that could represent the full complexity of a fictional world.",
    body: `
<h2>Why a flat notes system doesn't work</h2>
<p>The first thing most writers do when starting a complex project is open a second document and start a "character notes" file. Name, age, description, backstory. Maybe a "locations" document. Maybe a timeline spreadsheet.</p>
<p>By chapter ten, those docs are already out of date. The character changed. The timeline shifted. The writer stopped updating them because it felt like busywork. By the end of the first draft, the notes file is basically a fossil. A record of who the character was supposed to be, not who they actually turned out to be.</p>
<p>The Codex had to fix this by making updates automatic. And the data model needed to be rich enough to actually be useful mid-draft, not just as a lookup table after you've already made the mistake.</p>

<h2>The data model</h2>
<p>Every entity in the Codex is a document with a shared base schema and type-specific fields. A Character document covers <strong>physical description, personality traits, goals, fears, relationships, and known facts</strong>. Each field isn't a text blob. It's a list of discrete claims, each one tagged with the exact manuscript location where it was established.</p>
<p>That last part matters a lot. When the Oracle flags a conflict ("this character's eye color is described differently in chapter 3 and chapter 17"), it links you directly to both spots in the manuscript. No hunting.</p>

<h2>Automatic extraction pipeline</h2>
<p>When a writer finishes a scene block, PlotDr runs a background extraction job. The scene text goes through a two-stage process: first, entity detection (finding character names, location names, object references), then attribute extraction (pulling out any new information that should be added to existing Codex entries).</p>
<p>The extraction isn't perfect. No LLM extraction is. But it doesn't have to be. The system surfaces <strong>candidate updates</strong> and the writer approves, edits, or dismisses them with one click. The writer stays in control. The system handles the tedious job of noticing what changed.</p>
    `,
    wrong: {
      title: 'Relationship modeling was a rabbit hole',
      body: "I spent two weeks building a graph database layer for character relationships. Tracking not just who knows who, but the history and current state of every relationship. Even started wiring up Neo4j. Technically interesting, completely wrong for the actual need. Writers don't think about relationships as graph edges. They think about feelings. Scrapped it and replaced the whole thing with a plain text field: describe how these two characters relate, in your own words. Simpler, more useful, and writers actually fill it in.",
    },
    relatedPosts: ['why-plotdr', 'ai-memory-experiments'],
  },
  {
    id: 'why-hookdr',
    title: 'Why Most Content Diagnostics Are Wrong',
    subtitle: 'Post-publish analytics tell you what died. HookDr tells you why it was born wrong.',
    category: 'hookdr',
    catLabel: 'HookDr',
    date: 'May 2025',
    readTime: '5 min read',
    excerpt: 'Every content creator learns the same way: post, wait, check analytics, feel bad, repeat.',
    body: `
<h2>The broken feedback loop</h2>
<p>Every short-form creator learns the same way: post, wait, check analytics, feel bad, repeat. TikTok tells you retention dropped at 4 seconds. YouTube Shorts tells you 70% of people bailed in the first two seconds. Instagram says your reach was low.</p>
<p>None of them tell you <strong>why</strong>. The data is post-mortem. By the time you're reading it, the video is already out there. The damage is done.</p>
<p>And none of it transfers. Knowing a specific video died at 4 seconds doesn't tell you what to fix next time. It just tells you that one video failed at 4 seconds.</p>

<h2>What actually drives retention</h2>
<p>After digging into the research on short-form retention (MrBeast's editor's leaked doc, academic papers on video engagement, interviews with creators who've obsessed over this), some patterns keep coming up.</p>
<p>Retention is basically decided in the <strong>first 2-3 seconds</strong>. No pattern interrupt, no clear promise, no open loop by then, and the algorithm has already written your video off. The rest barely matters.</p>
<p>After the opening, it comes down to <strong>pacing</strong> (how much you're saying per second), <strong>surprise</strong> (unexpected cuts, new info, subverted expectations), and <strong>payoff proximity</strong> (does it feel like you're getting closer to the thing that was promised).</p>
<p>These things can be measured. They're structural patterns you can score from a script before you ever hit record.</p>

<h2>The HookDr approach</h2>
<p>HookDr works at the script level. Paste in your hook or your full script and the system scores it against these patterns. Not "this is good" or "this is bad" but specific problems: your opening question takes 8 words to land when it should take 4. Your content promise is buried in sentence 3. You have no pattern interrupt in the first 15 words.</p>
<p>The goal is to move the feedback loop from post-publish to pre-record. Get the structural problems out before they become live performance data.</p>
    `,
    wrong: {
      title: 'The first scoring model was too academic',
      body: "The first scoring model was built on academic engagement research. Weighted formulas, lexical density, sentence complexity. The scores were technically defensible and completely useless. \"Your lexical density score is 0.43\" means nothing to someone trying to make TikToks. Had to rebuild the entire output layer from scratch and translate every signal into plain English. The output is a product decision, not a technical one. It doesn't matter how good your model is if nobody can act on what it tells them.",
    },
    relatedPosts: ['retention-scoring'],
  },
  {
    id: 'retention-scoring',
    title: 'Building a Retention Scoring System',
    subtitle: 'How I turned engagement research into a scoring engine creators can actually use.',
    category: 'experiments',
    catLabel: 'Experiments',
    date: 'May 2025',
    readTime: '7 min read',
    excerpt: 'Scoring "engagement" sounds simple until you have to define what engagement actually means in numeric terms.',
    body: `
<h2>Starting with the research</h2>
<p>Before writing any code, I spent three weeks reading everything I could find on short-form retention. Academic papers, creator docs (including the MrBeast editing guide that leaked a couple years back), YouTube Creator Academy material, and a lot of watching high-performing videos and asking why they worked.</p>
<p>The goal was to find <strong>specific, testable claims</strong> about what structural features actually correlate with retention. Not vibes. Not "good energy." Things you can point to in a script.</p>

<h2>Designing the scoring dimensions</h2>
<p>I landed on five scoring dimensions:</p>
<ul>
<li><strong>Hook strength</strong>: does the opening create an open loop, make a bold claim, or introduce a pattern interrupt within the first 15 words?</li>
<li><strong>Content promise clarity</strong>: is it immediately obvious what the viewer gets by watching to the end?</li>
<li><strong>Pacing density</strong>: what's the information-to-word ratio? Are you being efficient?</li>
<li><strong>Surprise frequency</strong>: how often does the script drop new information or subvert an expectation?</li>
<li><strong>Payoff proximity</strong>: does the structure make the promised payoff feel like it's getting closer?</li>
</ul>
<p>Each dimension is scored 0-100. The composite score is a weighted average, with hook strength and content promise weighted most heavily because the research is clearest there.</p>

<h2>The prompt engineering challenge</h2>
<p>Getting consistent scores out of an LLM is harder than it sounds. Models are good at spotting patterns but unreliable with numbers. The same script could score 72 one call and 58 the next, depending on temperature and prompt phrasing.</p>
<p>The fix was a two-pass approach. First pass: pure analysis, describe what this hook is doing and what patterns it shows. Second pass: take that analysis and apply the scoring rubric. Splitting the two tasks produced dramatically more consistent numbers than asking for both at once.</p>
    `,
    wrong: {
      title: 'Multi-platform calibration was harder than expected',
      body: "I assumed the same model would work across TikTok, YouTube Shorts, and Reels with minor tweaks. Wrong. The optimal opening structure is genuinely different per platform. TikTok wants fast and direct. Shorts responds better to questions. Reels has different completion patterns because of the loop mechanic. Ended up building separate scoring profiles for each, which tripled the calibration work. Should have scoped that upfront instead of treating it as an afterthought.",
    },
    relatedPosts: ['why-hookdr'],
  },
  {
    id: 'raspberry-pi-character',
    title: 'Building a Voice AI Easter Island Head',
    subtitle: 'How I turned a 3D printed moai, a Raspberry Pi 5, and a handful of APIs into a talking prop.',
    category: 'aidevice',
    catLabel: 'AI Character Device',
    date: 'June 2025',
    readTime: '7 min read',
    excerpt: "The goal was simple: press a button, talk to an Easter Island Head. The execution was not simple.",
    body: `
<h2>The idea</h2>
<p>The goal was to build a voice-activated AI prop based on the Easter Island Head from Night at the Museum. A physical object that listens, responds in character, animates with LEDs, and speaks in a custom voice. The whole thing needed to live inside a 3D printed moai head as a Father's Day gift.</p>
<p>Press a button, ask a question, get a response in character. No screen. No keyboard. No setup. Just a rock that talks back.</p>
<p>The stack: Raspberry Pi 5, OpenAI Whisper for transcription, GPT-4o-mini for the brain, ElevenLabs for voice synthesis, WS2812B NeoPixels for LED animation, and a MAX98357A I2S amplifier for audio output. Everything running headlessly on boot via a systemd service.</p>

<h2>The voice pipeline</h2>
<img src="/assets/dumdum-architecture.png" alt="Voice pipeline architecture diagram" style="width:100%;border-radius:12px;border:1px solid #242424;margin:24px 0" />
<p>The core loop is straightforward: button press starts recording, energy-threshold VAD detects when you stop talking, audio goes to Whisper for transcription, the transcript goes to GPT-4o-mini with the character prompt and conversation history, the response goes to ElevenLabs, the MP3 comes back and gets converted to WAV via ffmpeg, then played through the amp via aplay.</p>
<p>The conversation history is a rolling 20-message buffer. Without it, every response felt disconnected. With it, the head actually remembers what you were just talking about, which makes the whole thing feel dramatically more alive.</p>

<h2>The character</h2>
<p>Building the system prompt took more work than expected. The head has specific speech patterns from the movie: it calls you "Dum-dum," uses doubled words for emphasis, and never says "gum" on its own. It's always "gum gum."</p>
<p>The first version overdid it. Every single word was doubled, which got grating fast. Pulled it back to using the doubled speech only for emphasis, with one hard rule: gum is always gum gum.</p>
<p>There was also a subtle detail that took a pass to fix: the head doesn't have a name. "Dum-dum" is what it calls you, not itself. It's the Easter Island Head. Getting that right made the character feel like the actual prop from the movie rather than a chatbot with a costume on.</p>

<h2>The LED system</h2>
<p>The NeoPixel ring sits in a pocket in the forehead of the head piece and tracks pipeline state in real time. Amber pulse at idle. Blue rotate when listening. Purple swirl when thinking. White pulse when speaking. Each state is distinct enough that you know exactly what the head is doing without any screen or sound cue.</p>
<p>The LEDs ended up being one of the most important parts of the build. Without them, the silence during API processing felt like the thing was broken. With them, it feels intentional. The head is clearly thinking.</p>

<h2>Latency masking</h2>
<p>Total round-trip latency through the pipeline is 3-6 seconds depending on network conditions. That's too long. The silence broke immersion completely.</p>
<p>The fix was a pre-generated audio clip in the head's own voice: "Me think now... Hmmmm..." It plays immediately after recording ends, running in a background subprocess. When the API response is ready, the subprocess gets terminated. If the response comes back quickly, the clip cuts off mid-hum, which sounds natural, like the character interrupted himself to start talking. It masks the latency and adds personality at the same time.</p>
    `,
    wrong: {
      title: 'sudo killed the API keys',
      body: "The systemd service runs as root, which means every subprocess runs under sudo. API keys set in the environment don't pass through sudo by default. Spent an embarrassing amount of time debugging what looked like authentication errors before realizing the keys just weren't there. The fix is sudo -E, which preserves the calling environment. Every subprocess call in the codebase now uses it. Should have known this going in.",
    },
    relatedPosts: ['dumdum-i2s-problem', 'dumdum-voice-pipeline', 'dumdum-3d-design'],
  },
  {
    id: 'dumdum-i2s-problem',
    title: 'The I2S Microphone Problem on Pi 5',
    subtitle: 'Six overlay attempts, one soldered mic that never worked, and why USB audio won in the end.',
    category: 'aidevice',
    catLabel: 'AI Character Device',
    date: 'June 2025',
    readTime: '8 min read',
    excerpt: "I spent more time on a microphone than on the AI. The Pi 5's I2S implementation has a problem that nobody warned me about.",
    body: `
<h2>Why I2S seemed like the right call</h2>
<p>The SPH0645 is a MEMS I2S microphone: tiny, clean audio, no moving parts, perfect for hiding inside a sealed prop. At roughly the size of a fingernail, it can sit right behind the nose pinholes in the 3D print. I soldered it to the perfboard early in the build, confident it would work.</p>
<p>It never worked. Not once.</p>

<h2>The dual I2S bus problem</h2>
<p>The Pi 5 handles I2S differently from the Pi 4. The HifiBerry DAC (for audio output) and the SPH0645 (for mic input) both need the I2S bus. On Pi 4 this is manageable. On Pi 5, they fight.</p>
<p>Every overlay combination either brought up the mic and killed the DAC, or brought up the DAC and left the mic invisible to the system. There was no configuration that ran both simultaneously.</p>
<p>Here's what was tried, in order:</p>
<ul>
<li><strong>googlevoicehat-soundcard</strong>: designed for exactly this use case on older Pi hardware. Ignored on Pi 5.</li>
<li><strong>i2s-mems-mic</strong>: mic showed up in arecord but DAC disappeared.</li>
<li><strong>adau7002-simple</strong>: same result.</li>
<li><strong>sph0645-microphone</strong>: the chip's own overlay. No mic, DAC survives.</li>
<li><strong>Custom device tree overlay</strong>: compiled from scratch, attempted to assign separate GPIO pins. Pi 5 ignored it.</li>
<li><strong>i2s-gpio28-31 secondary bus</strong>: Pi 5 doesn't expose this bus the same way as Pi 4. Dead end.</li>
</ul>
<p>After six attempts spanning multiple sessions, the conclusion was that the Pi 5's I2S implementation just isn't ready for dual-device setups at the community support level. There may be a path through custom kernel drivers or manufacturer-provided overlays that didn't exist at the time of this build.</p>

<h2>The actual fix</h2>
<p>Switched to a USB lapel microphone. The capsule is small enough to thread through the nose pinholes in the 3D print and sits flush against the interior wall. Audio quality is excellent for Whisper transcription, better honestly than the I2S mic would have been at the distances involved inside a sealed enclosure.</p>
<p>The SPH0645 is still soldered to the perfboard. It just sits there. No overlay loads it. It's not hurting anything.</p>

<h2>The environment setup saga</h2>
<p>Before any of the I2S debugging, there was the OS problem. The initial Pi 400 was running Raspbian Buster. The package repos were broken for anything modern. Python 3.11 wasn't available via apt. libffi was the wrong version.</p>
<p>First attempt: build Python 3.11 from source, a 15-minute compile. Hit a missing _ctypes module because libffi-dev wasn't installed before the build. Rebuilt. Then hit a libffi.so.8 vs libffi.so.7 mismatch that a symlink couldn't bridge.</p>
<p>Flashing a fresh Bookworm image took 20 minutes and fixed everything instantly. Every dependency resolved on the first try. The lesson is obvious in retrospect: don't fight old OS versions. The time spent fighting Buster would have flashed Bookworm six times over.</p>
    `,
    wrong: {
      title: 'I soldered the mic before testing it',
      body: "The SPH0645 went onto the perfboard during early hardware assembly, before the software stack was anywhere near ready. It felt efficient at the time. The problem is that by the time I discovered the I2S bus conflict, the mic was already permanently soldered in place. Desoldering it would have risked damaging the perfboard and other components. So it stays. If I'd done even a basic arecord test before soldering, I'd have caught the conflict immediately and saved the time spent on all six overlay attempts. Test before you solder.",
    },
    relatedPosts: ['raspberry-pi-character', 'dumdum-voice-pipeline'],
  },
  {
    id: 'dumdum-voice-pipeline',
    title: 'Building the Voice Pipeline for an AI Prop',
    subtitle: 'Whisper, GPT-4o-mini, ElevenLabs, and the 3-6 second silence that almost killed the immersion.',
    category: 'aidevice',
    catLabel: 'AI Character Device',
    date: 'June 2025',
    readTime: '7 min read',
    excerpt: "Three APIs, one character, and a silence that made the whole thing feel broken. Here's how I fixed it.",
    body: `
<h2>The pipeline</h2>
<p>The voice pipeline runs in a single Python loop. Button press triggers recording. Energy-threshold VAD monitors RMS audio levels in real time and stops recording after about 1.2 seconds of silence. The audio file goes to OpenAI Whisper for transcription. The transcript gets appended to the conversation history and sent to GPT-4o-mini with the character system prompt. The response comes back, goes to ElevenLabs with the custom voice ID, and returns as an MP3. ffmpeg converts it to WAV. aplay plays it through the MAX98357A amp.</p>
<p>That's the happy path. Getting to a reliable happy path took a while.</p>

<h2>Audio in and out</h2>
<p>Getting audio working on the Pi was its own project. The Pi has no mic input, so everything goes through USB. PortAudio wasn't installed by default and needed portaudio19-dev. The HyperX USB mic worked for development but was obviously too large for a sealed prop, which is what led to the I2S mic rabbit hole covered in the previous post.</p>
<p>For output, the MAX98357A I2S amp required enabling the hifiberry-dac overlay in config.txt and configuring /etc/asound.conf. Audio device numbers on the Pi change after every reboot, which caused multiple debugging sessions where everything worked, then stopped working the next day for no apparent reason. The fix is querying the device list on startup rather than hardcoding device numbers.</p>
<p>mpg123 was the first playback attempt. It kept failing under sudo due to PulseAudio permission issues. Switching to ffmpeg for conversion and aplay for playback bypasses PulseAudio entirely. Much more reliable.</p>

<h2>Voice activity detection</h2>
<p>The first recording implementation used a fixed 6-second window. Every interaction felt robotic and slow. Tried webrtcvad twice and both times it either froze indefinitely or failed to detect speech at all. The likely cause was a format mismatch between the USB mic's audio stream and what webrtcvad expected.</p>
<p>Energy threshold detection solved it. Monitor RMS audio energy in 50ms chunks. Start capturing when energy crosses the threshold. Stop after 1.2 seconds of sustained silence. It handles natural pauses mid-sentence without cutting off, and ends the recording promptly when you actually stop talking. Simple, reliable, no external dependency.</p>

<h2>The latency problem</h2>
<p>With Whisper transcription, GPT response generation, and ElevenLabs synthesis all running sequentially, the total round-trip is 3-6 seconds depending on network conditions. The first time this ran end-to-end, the silence between speaking and hearing a response felt like the whole thing had crashed. It killed the illusion completely.</p>
<p>The fix was a thinking sound. A short audio clip generated in the prop's actual voice, saying "Me think now... Hmmmm..." It plays immediately when recording ends, in a background subprocess. The main process continues hitting the APIs. When the response is ready, it terminates the subprocess and starts playing the actual response.</p>
<p>If the APIs respond quickly, the clip cuts off mid-hum. That turned out to be a happy accident. It sounds exactly like the character started to think, then figured it out and interrupted himself. It adds personality. The 3-6 second wait that felt broken now feels like the head is genuinely working through something.</p>

<h2>Conversation history</h2>
<p>A rolling 20-message buffer stores every exchange and gets passed in full with each API call. Without it, every response was context-free. The head would ask your name, you'd tell it, and two exchanges later it had no idea who you were. With the history, it tracks what's been discussed, builds on previous answers, and reacts to things said earlier in the conversation. The difference between talking to a chatbot and talking to a character.</p>
    `,
    wrong: {
      title: 'mpg123 and sudo do not get along',
      body: "Early playback used mpg123, which works fine when you run the script directly. Run it under sudo (which the systemd service does) and PulseAudio locks it out entirely. The error message is not obvious about why. Spent time thinking it was a codec issue, then an audio device issue, before realizing it was a permissions conflict specific to running as root. The fix, converting to WAV with ffmpeg and using aplay, is actually better anyway. aplay is lower-level, more reliable, and has no PulseAudio dependency. Should have started there.",
    },
    relatedPosts: ['raspberry-pi-character', 'dumdum-i2s-problem', 'dumdum-3d-design'],
  },
  {
    id: 'dumdum-3d-design',
    title: '3D Printing a Voice AI Prop',
    subtitle: 'How I designed a hollowed moai enclosure that fits a Pi 5, a perfboard, an amp, a speaker, LEDs, and a mic inside 240mm of fake stone.',
    category: 'aidevice',
    catLabel: 'AI Character Device',
    date: 'June 2025',
    readTime: '6 min read',
    excerpt: "Fitting a Raspberry Pi 5, audio hardware, LEDs, and a speaker inside a 240mm moai head required more TinkerCAD sessions than I'd like to admit.",
    body: `
<h2>Starting with an STL</h2>
<p>The moai model came from an online STL library: a solid, decorative Easter Island head with no interior space whatsoever. Imported into TinkerCAD at 240mm tall and started modifying from there.</p>
<p>The first decision was where to split the model. The head needed to come apart for assembly and maintenance, and the split needed to happen at a logical point. The neck line at 52mm up from the base was the obvious choice. It's a natural seam, it gives the head piece enough interior volume for the speaker, LEDs, and mic, and it puts the Pi and electronics in the chest/base piece where there's more room.</p>

<h2>The chest piece</h2>
<p>The chest piece is where all the heavy hardware lives. The Pi 5 mounts vertically on velcro against the back wall. Velcro because the Pi occasionally needs to come out, and screws would require threaded inserts in the print. The perfboard sits beside it with all the components: the MAX98357A amp, the NeoPixel ring wiring, the push button wiring, and the SPH0645 that never worked but gets to stay anyway.</p>
<p>The exterior has a USB-C cable exit hole in the back wall for power, a button hole on the side at a height that feels natural to press, and 16 ventilation holes across the back panel for the Pi 5's active cooler fan. The cooler runs warm under sustained API load, and without airflow the interior temperature climbs fast.</p>

<h2>The head piece</h2>
<p>The head piece has three functional elements. Speaker grille holes in the mouth: rows of small circles that let sound out while looking like part of the character's expression. Mic pinholes in the nose: four small holes that let the USB lapel capsule pick up audio from inside the sealed head. And an LED pocket in the forehead: a recessed cylinder sized exactly for the 12-LED NeoPixel ring, sitting just behind the surface of the print so the light diffuses through the plastic rather than blasting out a visible hotspot.</p>
<p>The two pieces connect via a friction-fit lip: a 10mm deep male/female joint with 0.3mm of tolerance. Tight enough that the head doesn't wobble, loose enough that it can be separated without tools.</p>

<h2>Print settings and material</h2>
<p>Both pieces printed in PLA. Standard 0.2mm layer height, 20% infill for the solid sections, 4 perimeters on the walls for rigidity. The head piece printed upright with supports inside the mouth opening. The chest piece printed on its back with the interior facing up.</p>
<p>Total print time across both pieces was roughly 18 hours. The plan after delivery is gray filler primer to fill the layer lines and get a stone texture, followed by airbrushing with gray and brown tones to match the movie prop.</p>

<h2>Assembly order</h2>
<p>Getting everything inside in the right order matters. The speaker goes in the head piece first, wired through to the chest before the pieces join. The LED ring drops into the forehead pocket and the wires run down through a channel in the neck joint. The USB lapel mic capsule feeds up through the nose pinholes from inside. Then the head piece sits on the chest piece and the friction lip clicks into place.</p>
<p>Everything is accessible by separating the two pieces. No screws to remove, no components glued in place.</p>
    `,
    wrong: {
      title: 'Pi 5 spec sheet dimensions are wrong',
      body: "Downloaded the official Raspberry Pi 5 mechanical drawing from the Pi Foundation website and built the interior layout around those dimensions. First test fit of the actual board: it didn't fit. The spec sheet dimensions were slightly off from the real thing, and the active cooler adds height that the drawing didn't account for at all. Had to go back into TinkerCAD and rework the interior cavity with the actual board in hand. Lesson: measure your components with calipers before modeling anything around them. Spec sheets lie. The board in your hand doesn't.",
    },
    relatedPosts: ['raspberry-pi-character', 'dumdum-voice-pipeline'],
  },
  {
    id: 'ai-memory-experiments',
    title: 'Testing AI Memory Systems',
    subtitle: 'Three approaches to AI memory. One actually held up in production.',
    category: 'experiments',
    catLabel: 'Experiments',
    date: 'May 2025',
    readTime: '9 min read',
    excerpt: "Every AI product I've built has needed persistent memory. None of the obvious approaches work the way you'd expect.",
    body: `
<h2>Why AI memory is hard</h2>
<p>Every AI product I've built has needed some form of persistent memory. PlotDr needs to remember the whole manuscript. The Character Device needs to remember past conversations. HookDr needs to remember a creator's past analyses to spot patterns over time.</p>
<p>In every case, the obvious first move (pass everything into the context window) breaks down fast. Token limits. Slow completions. Models getting distracted by irrelevant context. You need something smarter.</p>

<h2>Approach 1: Hierarchical summarization</h2>
<p>First approach: keep a rolling summary that updates as new content is added. For PlotDr this meant a "story so far" doc that compressed progressively. Scene summaries rolled up into chapter summaries, chapter summaries rolled up into act summaries.</p>
<p>This works for <strong>narrative continuity</strong>. The model understands the arc of the story. But it's useless for <strong>specific facts</strong>. Need to know a character's exact eye color or the precise wording of a prophecy? The summary ate it.</p>

<h2>Approach 2: RAG</h2>
<p>Second approach: store memories as vector embeddings, retrieve the most relevant ones before each LLM call. RAG. Currently the most common pattern for AI memory.</p>
<p>RAG is solid for <strong>fact retrieval</strong>. Store "Aldric has blue eyes, introduced in chapter 3" as an embedding, ask "what color are Aldric's eyes," you'll get it back reliably.</p>
<p>The problem is RAG assumes you know what to look for. When you're mid-scene, you don't always know in advance which specific facts are relevant. You need a good query to retrieve anything useful, and generating that query from a creative writing context is harder than it sounds.</p>

<h2>Approach 3: Structured entity state</h2>
<p>What actually worked: structured entity state. Store the memory as a JSON document with typed fields per entity. Before each LLM call, serialize the relevant entities into a compact format and inject them directly into context.</p>
<p>Less flexible than RAG. You can't query it with natural language. But it's <strong>deterministic</strong>. You always know exactly what the model has access to because you put it there. And the compact format means you can inject 20+ characters worth of data without blowing your token budget.</p>
    `,
    wrong: {
      title: "I built a vector database I didn't need",
      body: "Spent six weeks convinced a vector database was the right foundation (tried Pinecone, then Weaviate). Built a whole pipeline around it. Demos looked great. In real writing workflows it kept missing things. Writers would catch inconsistencies the system should have flagged. The non-determinism that makes RAG feel magical in demos makes it unreliable in production. Structured entity state is less impressive to talk about and significantly more trustworthy to ship. Sometimes that's the trade.",
    },
    relatedPosts: ['why-plotdr', 'raspberry-pi-character'],
  },
]

export const CAT_LABELS = {
  all: 'All Posts',
  plotdr: 'PlotDr',
  hookdr: 'HookDr',
  aidevice: 'AI Character Device',
  lessons: 'Lessons Learned',
  experiments: 'Experiments',
}
