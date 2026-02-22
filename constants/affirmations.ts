export type Category = 'faith' | 'financial' | 'healing' | 'purpose' | 'discipline' | 'leadership';

export interface Affirmation {
  id: string;
  text: string;
  verse: string;
  verseRef: string;
  category: Category;
}

export interface Devotional {
  id: string;
  title: string;
  scripture: string;
  scriptureRef: string;
  reflection: string;
  prayer: string;
  dayIndex: number;
}

export const categoryInfo: Record<Category, { label: string; icon: string; iconSet: 'Ionicons' | 'MaterialCommunityIcons'; color: string; darkColor: string }> = {
  faith: { label: 'Faith', icon: 'shield-checkmark-outline', iconSet: 'Ionicons', color: '#2D5A3D', darkColor: '#5BA67A' },
  financial: { label: 'Financial Breakthrough', icon: 'cash-outline', iconSet: 'Ionicons', color: '#C8963E', darkColor: '#D4A853' },
  healing: { label: 'Healing', icon: 'heart-outline', iconSet: 'Ionicons', color: '#C44536', darkColor: '#E06050' },
  purpose: { label: 'Purpose', icon: 'compass-outline', iconSet: 'Ionicons', color: '#4A6FA5', darkColor: '#6B8FC5' },
  discipline: { label: 'Discipline', icon: 'fitness-outline', iconSet: 'Ionicons', color: '#7B5EA7', darkColor: '#9B7EC7' },
  leadership: { label: 'Leadership', icon: 'flag-outline', iconSet: 'Ionicons', color: '#1B2838', darkColor: '#A0B0C0' },
};

export const affirmations: Affirmation[] = [
  { id: 'f1', text: 'I am a child of God, chosen and deeply loved. My identity is rooted in Christ alone.', verse: 'See what great love the Father has lavished on us, that we should be called children of God!', verseRef: '1 John 3:1', category: 'faith' },
  { id: 'f2', text: 'My faith is unshakable because it is built on the rock of God\'s promises.', verse: 'Therefore everyone who hears these words of mine and puts them into practice is like a wise man who built his house on the rock.', verseRef: 'Matthew 7:24', category: 'faith' },
  { id: 'f3', text: 'I walk by faith, not by sight. God\'s plan for my life is greater than I can imagine.', verse: 'For we live by faith, not by sight.', verseRef: '2 Corinthians 5:7', category: 'faith' },
  { id: 'f4', text: 'God has not given me a spirit of fear, but of power, love, and a sound mind.', verse: 'For the Spirit God gave us does not make us timid, but gives us power, love and self-discipline.', verseRef: '2 Timothy 1:7', category: 'faith' },
  { id: 'f5', text: 'I am more than a conqueror through Christ who strengthens me.', verse: 'No, in all these things we are more than conquerors through him who loved us.', verseRef: 'Romans 8:37', category: 'faith' },
  { id: 'f6', text: 'The Lord is my shepherd; I lack nothing. He leads me beside still waters and restores my soul.', verse: 'The Lord is my shepherd, I lack nothing.', verseRef: 'Psalm 23:1', category: 'faith' },
  { id: 'f7', text: 'I trust in the Lord with all my heart and lean not on my own understanding.', verse: 'Trust in the Lord with all your heart and lean not on your own understanding.', verseRef: 'Proverbs 3:5', category: 'faith' },
  { id: 'f8', text: 'I am fearfully and wonderfully made. God\'s works are wonderful and I know that full well.', verse: 'I praise you because I am fearfully and wonderfully made; your works are wonderful, I know that full well.', verseRef: 'Psalm 139:14', category: 'faith' },

  { id: 'fn1', text: 'God supplies all my needs according to His glorious riches in Christ Jesus.', verse: 'And my God will meet all your needs according to the riches of his glory in Christ Jesus.', verseRef: 'Philippians 4:19', category: 'financial' },
  { id: 'fn2', text: 'I am blessed and I am a blessing. Wealth and riches are in my house because of God\'s favor.', verse: 'Wealth and riches are in their houses, and their righteousness endures forever.', verseRef: 'Psalm 112:3', category: 'financial' },
  { id: 'fn3', text: 'The Lord has given me the power to create wealth and establish His covenant.', verse: 'But remember the Lord your God, for it is he who gives you the ability to produce wealth.', verseRef: 'Deuteronomy 8:18', category: 'financial' },
  { id: 'fn4', text: 'I am generous and lend freely, and my affairs are conducted with justice.', verse: 'Good will come to those who are generous and lend freely, who conduct their affairs with justice.', verseRef: 'Psalm 112:5', category: 'financial' },
  { id: 'fn5', text: 'God opens the windows of heaven and pours out blessings that I cannot contain.', verse: 'See if I will not throw open the floodgates of heaven and pour out so much blessing that there will not be room enough to store it.', verseRef: 'Malachi 3:10', category: 'financial' },
  { id: 'fn6', text: 'I honor the Lord with my wealth and my barns will be filled to overflowing.', verse: 'Honor the Lord with your wealth, with the firstfruits of all your crops.', verseRef: 'Proverbs 3:9', category: 'financial' },
  { id: 'fn7', text: 'The blessing of the Lord brings wealth, without painful toil for it.', verse: 'The blessing of the Lord brings wealth, without painful toil for it.', verseRef: 'Proverbs 10:22', category: 'financial' },
  { id: 'fn8', text: 'I am planted like a tree by streams of water, and whatever I do prospers.', verse: 'That person is like a tree planted by streams of water, which yields its fruit in season.', verseRef: 'Psalm 1:3', category: 'financial' },

  { id: 'h1', text: 'By His stripes, I am healed. God\'s healing power flows through every part of my being.', verse: 'But he was pierced for our transgressions, he was crushed for our iniquities; the punishment that brought us peace was on him, and by his wounds we are healed.', verseRef: 'Isaiah 53:5', category: 'healing' },
  { id: 'h2', text: 'The Lord restores my health and heals all my wounds. I am whole in Jesus\' name.', verse: 'But I will restore you to health and heal your wounds, declares the Lord.', verseRef: 'Jeremiah 30:17', category: 'healing' },
  { id: 'h3', text: 'God heals all my diseases and redeems my life from the pit. He crowns me with love and compassion.', verse: 'Who forgives all your sins and heals all your diseases.', verseRef: 'Psalm 103:3', category: 'healing' },
  { id: 'h4', text: 'I am the Lord who heals you. No sickness or disease shall come near my dwelling.', verse: 'For I am the Lord, who heals you.', verseRef: 'Exodus 15:26', category: 'healing' },
  { id: 'h5', text: 'My body is the temple of the Holy Spirit. I am strengthened and renewed daily.', verse: 'Do you not know that your bodies are temples of the Holy Spirit, who is in you?', verseRef: '1 Corinthians 6:19', category: 'healing' },
  { id: 'h6', text: 'The prayer of faith shall save the sick, and the Lord shall raise them up.', verse: 'And the prayer offered in faith will make the sick person well; the Lord will raise them up.', verseRef: 'James 5:15', category: 'healing' },
  { id: 'h7', text: 'God gives power to the faint and increases strength to those who have no might.', verse: 'He gives strength to the weary and increases the power of the weak.', verseRef: 'Isaiah 40:29', category: 'healing' },
  { id: 'h8', text: 'Peace I leave with you; my peace I give you. My heart is not troubled and unafraid.', verse: 'Peace I leave with you; my peace I give you. I do not give to you as the world gives.', verseRef: 'John 14:27', category: 'healing' },

  { id: 'p1', text: 'God has a purpose for my life. I am His workmanship, created for good works.', verse: 'For we are God\'s handiwork, created in Christ Jesus to do good works, which God prepared in advance for us to do.', verseRef: 'Ephesians 2:10', category: 'purpose' },
  { id: 'p2', text: 'I know the plans God has for me \u2014 plans to prosper me and give me hope and a future.', verse: 'For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you.', verseRef: 'Jeremiah 29:11', category: 'purpose' },
  { id: 'p3', text: 'God called me before I was born. He set me apart and appointed me for His glory.', verse: 'Before I formed you in the womb I knew you, before you were born I set you apart.', verseRef: 'Jeremiah 1:5', category: 'purpose' },
  { id: 'p4', text: 'I am the light of the world. My life shines brightly for God\'s kingdom.', verse: 'You are the light of the world. A town built on a hill cannot be hidden.', verseRef: 'Matthew 5:14', category: 'purpose' },
  { id: 'p5', text: 'God works all things together for my good because I love Him and am called according to His purpose.', verse: 'And we know that in all things God works for the good of those who love him.', verseRef: 'Romans 8:28', category: 'purpose' },
  { id: 'p6', text: 'I press toward the mark for the prize of the high calling of God in Christ Jesus.', verse: 'I press on toward the goal to win the prize for which God has called me heavenward in Christ Jesus.', verseRef: 'Philippians 3:14', category: 'purpose' },
  { id: 'p7', text: 'The steps of a good person are ordered by the Lord. He delights in every detail of my life.', verse: 'The Lord makes firm the steps of the one who delights in him.', verseRef: 'Psalm 37:23', category: 'purpose' },
  { id: 'p8', text: 'I am an ambassador for Christ. God makes His appeal through me to the world.', verse: 'We are therefore Christ\'s ambassadors, as though God were making his appeal through us.', verseRef: '2 Corinthians 5:20', category: 'purpose' },

  { id: 'd1', text: 'I discipline my body and keep it under control, so that I may not be disqualified.', verse: 'No, I strike a blow to my body and make it my slave so that after I have preached to others, I myself will not be disqualified for the prize.', verseRef: '1 Corinthians 9:27', category: 'discipline' },
  { id: 'd2', text: 'I set my mind on things above, not on earthly things. My focus is on eternal matters.', verse: 'Set your minds on things above, not on earthly things.', verseRef: 'Colossians 3:2', category: 'discipline' },
  { id: 'd3', text: 'I run the race marked out for me with perseverance, fixing my eyes on Jesus.', verse: 'Let us run with perseverance the race marked out for us, fixing our eyes on Jesus.', verseRef: 'Hebrews 12:1-2', category: 'discipline' },
  { id: 'd4', text: 'The fruit of the Spirit produces self-control in me. I am led by the Spirit in all things.', verse: 'But the fruit of the Spirit is love, joy, peace, forbearance, kindness, goodness, faithfulness, gentleness and self-control.', verseRef: 'Galatians 5:22-23', category: 'discipline' },
  { id: 'd5', text: 'I delight in God\'s law and meditate on it day and night. His Word is a lamp to my feet.', verse: 'But whose delight is in the law of the Lord, and who meditates on his law day and night.', verseRef: 'Psalm 1:2', category: 'discipline' },
  { id: 'd6', text: 'I can do all things through Christ who gives me strength. Nothing is impossible.', verse: 'I can do all this through him who gives me strength.', verseRef: 'Philippians 4:13', category: 'discipline' },
  { id: 'd7', text: 'The steadfast love of the Lord never ceases. His mercies are new every morning.', verse: 'Because of the Lord\'s great love we are not consumed, for his compassions never fail. They are new every morning.', verseRef: 'Lamentations 3:22-23', category: 'discipline' },
  { id: 'd8', text: 'I commit my way to the Lord and trust in Him. He will make my righteousness shine.', verse: 'Commit your way to the Lord; trust in him and he will do this.', verseRef: 'Psalm 37:5', category: 'discipline' },

  { id: 'l1', text: 'God has anointed me to lead with wisdom, integrity, and a servant\'s heart.', verse: 'The greatest among you will be your servant.', verseRef: 'Matthew 23:11', category: 'leadership' },
  { id: 'l2', text: 'I lead others with the same mind that was in Christ Jesus \u2014 humble and obedient.', verse: 'In your relationships with one another, have the same mindset as Christ Jesus.', verseRef: 'Philippians 2:5', category: 'leadership' },
  { id: 'l3', text: 'The Lord gives me wisdom and from His mouth come knowledge and understanding.', verse: 'For the Lord gives wisdom; from his mouth come knowledge and understanding.', verseRef: 'Proverbs 2:6', category: 'leadership' },
  { id: 'l4', text: 'I am strong and courageous. I do not fear, for the Lord my God goes with me.', verse: 'Be strong and courageous. Do not be afraid or terrified because of them, for the Lord your God goes with you.', verseRef: 'Deuteronomy 31:6', category: 'leadership' },
  { id: 'l5', text: 'Where there is no vision, people perish. God has given me vision for His purposes.', verse: 'Where there is no revelation, people cast off restraint; but blessed is the one who heeds wisdom\'s instruction.', verseRef: 'Proverbs 29:18', category: 'leadership' },
  { id: 'l6', text: 'I shepherd those God has placed in my care with integrity and skillful hands.', verse: 'And David shepherded them with integrity of heart; with skillful hands he led them.', verseRef: 'Psalm 78:72', category: 'leadership' },
  { id: 'l7', text: 'Iron sharpens iron. I surround myself with wise counsel and build others up.', verse: 'As iron sharpens iron, so one person sharpens another.', verseRef: 'Proverbs 27:17', category: 'leadership' },
  { id: 'l8', text: 'I have been given authority to tread on serpents and scorpions. Nothing shall harm me.', verse: 'I have given you authority to trample on snakes and scorpions and to overcome all the power of the enemy.', verseRef: 'Luke 10:19', category: 'leadership' },
];

export const devotionals: Devotional[] = [
  {
    id: 'dev1', dayIndex: 0,
    title: 'Walking in Confidence',
    scripture: 'The Lord himself goes before you and will be with you; he will never leave you nor forsake you. Do not be afraid; do not be discouraged.',
    scriptureRef: 'Deuteronomy 31:8',
    reflection: 'Today, remember that your confidence does not come from your own abilities, but from the God who goes before you. Every challenge you face has already been seen by the One who holds your future. When anxiety whispers that you\'re not enough, let God\'s truth speak louder: He is with you, He will never leave you, and He has already made a way.',
    prayer: 'Lord, help me to walk in confidence today, knowing that You go before me. Remove every trace of fear and replace it with unshakable faith. Let me move forward boldly, trusting in Your plan. Amen.'
  },
  {
    id: 'dev2', dayIndex: 1,
    title: 'The Power of Stillness',
    scripture: 'Be still, and know that I am God; I will be exalted among the nations, I will be exalted in the earth.',
    scriptureRef: 'Psalm 46:10',
    reflection: 'In a world that never stops moving, God calls us to be still. Stillness is not weakness\u2014it is an act of radical trust. When you stop striving and simply rest in His presence, you acknowledge that He is sovereign over every situation. Today, take a moment to be still. Let go of the need to control, and simply be in His presence.',
    prayer: 'Father, teach me the discipline of stillness. In the busyness of life, help me find moments to pause and acknowledge Your sovereignty. Let my spirit be refreshed in Your presence today. Amen.'
  },
  {
    id: 'dev3', dayIndex: 2,
    title: 'Seeds of Generosity',
    scripture: 'Remember this: Whoever sows sparingly will also reap sparingly, and whoever sows generously will also reap generously.',
    scriptureRef: '2 Corinthians 9:6',
    reflection: 'Generosity is not just about money\u2014it\'s about how freely you give your time, attention, love, and grace. When you give generously, you reflect the heart of God, who gave His only Son for us. Today, look for opportunities to sow generously into someone\'s life. A kind word, a listening ear, or a helping hand can change someone\'s entire day.',
    prayer: 'Lord, make me generous in every way. Open my eyes to the needs around me and give me the courage to give freely. Let my life be a reflection of Your overwhelming generosity. Amen.'
  },
  {
    id: 'dev4', dayIndex: 3,
    title: 'Overcoming Through Prayer',
    scripture: 'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.',
    scriptureRef: 'Philippians 4:6',
    reflection: 'Prayer is not a last resort\u2014it is the first response of a believer who trusts God. When worry tries to overtake you, redirect that energy into prayer. God invites you to bring everything to Him: your fears, your dreams, your confusion, and your gratitude. He is never too busy to listen, and He is never unable to act.',
    prayer: 'Heavenly Father, I bring all my anxieties to You today. I choose prayer over worry, faith over fear. Thank You for always listening and for working all things for my good. Amen.'
  },
  {
    id: 'dev5', dayIndex: 4,
    title: 'The Strength in Weakness',
    scripture: 'But he said to me, "My grace is sufficient for you, for my power is made perfect in weakness."',
    scriptureRef: '2 Corinthians 12:9',
    reflection: 'Our culture celebrates strength and self-sufficiency, but God works differently. He uses our weaknesses as doorways for His power. When you feel inadequate, remember that you are the perfect candidate for God\'s grace. Your limitations are not liabilities\u2014they are invitations for God to show up in extraordinary ways.',
    prayer: 'Lord, I surrender my weaknesses to You today. I trust that Your grace is more than enough for every challenge I face. Use my imperfections to display Your perfect power. Amen.'
  },
  {
    id: 'dev6', dayIndex: 5,
    title: 'Renewing Your Mind',
    scripture: 'Do not conform to the pattern of this world, but be transformed by the renewing of your mind.',
    scriptureRef: 'Romans 12:2',
    reflection: 'Transformation begins in the mind. The thoughts you feed grow stronger, and the thoughts you starve grow weaker. God\'s Word is the ultimate mind-renewing agent. When you fill your mind with His truth, negative patterns break, and a new way of thinking emerges. Today, choose to replace one negative thought pattern with a promise from God\'s Word.',
    prayer: 'Father, renew my mind today. Help me to reject the patterns of this world and embrace Your truth. Transform my thinking so that my actions reflect Your character. Amen.'
  },
  {
    id: 'dev7', dayIndex: 6,
    title: 'A Heart of Gratitude',
    scripture: 'Give thanks in all circumstances; for this is God\'s will for you in Christ Jesus.',
    scriptureRef: '1 Thessalonians 5:18',
    reflection: 'Gratitude is not about ignoring hardship\u2014it\'s about choosing to see God\'s faithfulness even in the midst of difficulty. A grateful heart shifts your perspective from what\'s lacking to what\'s been given. Today, list three things you\'re thankful for, even small ones. Watch how gratitude changes the atmosphere of your heart.',
    prayer: 'Lord, I choose gratitude today. Thank You for every blessing, seen and unseen. Help me to cultivate a heart that overflows with thanksgiving in every season. Amen.'
  },
  {
    id: 'dev8', dayIndex: 7,
    title: 'Walking in Love',
    scripture: 'Dear friends, let us love one another, for love comes from God. Everyone who loves has been born of God and knows God.',
    scriptureRef: '1 John 4:7',
    reflection: 'Love is not merely an emotion\u2014it is a choice and an action. God\'s love is sacrificial, unconditional, and transformative. When you choose to love others as God loves you, you become a living testimony of His grace. Today, extend love to someone who may not deserve it. That is the very essence of grace.',
    prayer: 'God, fill my heart with Your love today. Help me to love others the way You love me\u2014without conditions, without limits. Let my love be a reflection of Yours. Amen.'
  },
  {
    id: 'dev9', dayIndex: 8,
    title: 'God\'s Unfailing Faithfulness',
    scripture: 'Know therefore that the Lord your God is God; he is the faithful God, keeping his covenant of love to a thousand generations.',
    scriptureRef: 'Deuteronomy 7:9',
    reflection: 'When everything around you seems uncertain, God\'s faithfulness remains constant. He has never broken a promise, never failed to show up, and never abandoned His people. Your current season may feel confusing, but God is working behind the scenes with perfect timing and infinite wisdom. Trust His faithfulness today.',
    prayer: 'Faithful God, I choose to trust You today even when I cannot see the full picture. Your track record is perfect, and I rest in the assurance that You will never fail me. Amen.'
  },
  {
    id: 'dev10', dayIndex: 9,
    title: 'The Joy of the Lord',
    scripture: 'Nehemiah said, "Go and enjoy choice food and sweet drinks, and send some to those who have nothing prepared. This day is holy to our Lord. Do not grieve, for the joy of the Lord is your strength."',
    scriptureRef: 'Nehemiah 8:10',
    reflection: 'True joy is not dependent on circumstances\u2014it flows from a deep relationship with God. The joy of the Lord is not a fleeting happiness but a deep, abiding strength that sustains you through every trial. Today, choose joy. Not because everything is perfect, but because the God who holds your life is perfect.',
    prayer: 'Lord, fill me with Your joy today. Not a shallow happiness, but a deep, abiding joy that comes from knowing You. Let Your joy be my strength in every moment. Amen.'
  },
  {
    id: 'dev11', dayIndex: 10,
    title: 'Armor of God',
    scripture: 'Put on the full armor of God, so that you can take your stand against the devil\'s schemes.',
    scriptureRef: 'Ephesians 6:11',
    reflection: 'Every day is a spiritual battle, but God has not left you defenseless. He has equipped you with truth, righteousness, peace, faith, salvation, and His Word. Put on your armor daily through prayer and Scripture. You are not fighting for victory\u2014you are fighting from victory, because Christ has already won.',
    prayer: 'Lord, I put on Your full armor today. Guard my mind with the helmet of salvation, protect my heart with the breastplate of righteousness, and arm me with the sword of Your Spirit. Amen.'
  },
  {
    id: 'dev12', dayIndex: 11,
    title: 'Divine Patience',
    scripture: 'But if we hope for what we do not yet have, we wait for it patiently.',
    scriptureRef: 'Romans 8:25',
    reflection: 'Waiting is one of the hardest disciplines of faith, yet it is where some of the deepest growth happens. God\'s timing is never early and never late. In the waiting, He is preparing you for what He has prepared for you. Trust the process. Your breakthrough is not delayed\u2014it is being perfected.',
    prayer: 'Father, give me patience to wait on Your perfect timing. Help me trust that every delay is part of Your divine plan. Strengthen my faith in the waiting season. Amen.'
  },
  {
    id: 'dev13', dayIndex: 12,
    title: 'Living with Purpose',
    scripture: 'For to me, to live is Christ and to die is gain.',
    scriptureRef: 'Philippians 1:21',
    reflection: 'When Christ becomes the center of your life, everything else falls into its proper place. Your career, relationships, and goals take on eternal significance. Living with purpose means aligning your daily choices with God\'s eternal plan. Today, ask yourself: Is Christ the driving force behind my decisions?',
    prayer: 'Lord Jesus, be the center of everything I do today. Align my purpose with Yours, my will with Yours, and my desires with Yours. Let me live fully for You. Amen.'
  },
  {
    id: 'dev14', dayIndex: 13,
    title: 'Restored and Renewed',
    scripture: 'He restores my soul. He leads me in paths of righteousness for his name\'s sake.',
    scriptureRef: 'Psalm 23:3',
    reflection: 'No matter how worn out, broken, or weary you feel, God is in the business of restoration. He takes broken pieces and creates beautiful mosaics. He takes dry bones and breathes life. Today, surrender every area that needs restoration to the Master Restorer. He will make all things new.',
    prayer: 'Restorer of my soul, I bring every broken area of my life to You. Heal what is wounded, revive what is dormant, and renew what is weary. Make me whole again. Amen.'
  },
];

export function getDailyAffirmation(): Affirmation {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  return affirmations[dayOfYear % affirmations.length];
}

export function getDailyDevotional(): Devotional {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  return devotionals[dayOfYear % devotionals.length];
}

export function getAffirmationsByCategory(category: Category): Affirmation[] {
  return affirmations.filter(a => a.category === category);
}
