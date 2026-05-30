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
    title: 'Turning a Raspberry Pi Into a Character',
    subtitle: 'What happens when you give an AI a body, a name, and a reason to exist.',
    category: 'aidevice',
    catLabel: 'AI Character Device',
    date: 'May 2025',
    readTime: '6 min read',
    excerpt: "There's a real difference between talking to an AI and talking to a character. One feels like a tool. The other feels like something.",
    body: `
<h2>Why hardware matters</h2>
<p>There's a real difference between talking to an AI and talking to a character. One feels like a tool. The other feels like something.</p>
<p>When you open ChatGPT or Claude, you're using an app. Browser tab, text field, response area. Your brain knows exactly what it is.</p>
<p>When you talk to a physical object that responds, that glows when it's thinking, that has a voice coming from a specific spot in the room, something different happens. The experience isn't on a screen. It's just there. <strong>Present</strong>.</p>
<p>That's the whole bet behind this project. Not that Raspberry Pi is a better AI platform than a phone (it's obviously not), but that the physical form factor creates a different kind of relationship.</p>

<h2>The technical stack</h2>
<p>The device runs a Python voice pipeline on a Raspberry Pi 4. Wake word detection runs locally, always listening, low CPU overhead. When the wake word fires, it records until there's silence, sends audio to a speech-to-text API, passes the transcript to an LLM along with the character's system prompt and conversation history, gets a response back, runs it through text-to-speech, and plays it through a small speaker.</p>
<p>The LED ring (a NeoPixel-style addressable RGB strip) tracks every state in the pipeline. Blue pulse when listening. White spin when processing. Green glow when speaking. The LEDs turned out to be the most important thing in the whole build.</p>

<h2>Designing the character system</h2>
<p>Each character is defined by a JSON profile: a name, a core personality description, a set of behavioral rules, a speaking style guide, and a list of known facts that seed the character's initial knowledge.</p>
<p>Swapping characters is just loading a different JSON profile. Same hardware. Completely different name, voice, personality, and knowledge base.</p>
<p>The trickiest design problem was <strong>memory across sessions</strong>. A chatbot forgets everything when you close the tab. That's fine for a browser. But a physical device sitting on your desk creates an expectation of continuity. The character should remember that you talked yesterday. It should know your name. A JSON file of summarized past interactions gets loaded into the context at the start of each new session.</p>
    `,
    wrong: {
      title: 'Latency killed the first version',
      body: "First version routed everything through remote APIs with no optimization. End-to-end latency was 4-6 seconds from wake word to first audio. For voice, that's a dealbreaker. Conversations feel broken past 2 seconds. Had to rebuild the pipeline: local wake word detection instead of streaming to cloud, streaming TTS so audio starts before the full response is ready, response caching for common interactions. Got it under 2 seconds. Latency in voice interfaces isn't an optimization you get to later. It's the product.",
    },
    relatedPosts: ['ai-memory-experiments'],
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
      title: 'I built a vector database I didn\'t need',
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
