import arcjet, { shield, detectBot, slidingWindow } from '@arcjet/node';

const aj = arcjet({
  key: process.env.ARCJET_KEY,

  rules: [
    shield({ mode: 'LIVE' }),
    
    detectBot({
      mode: 'LIVE',
      allow: [
        'CATEGORY:SEARCH_ENGINE',
        'CATEGORY:MONITOR', 
        'CATEGORY:PREVIEW', 
      ],
    }),

    slidingWindow({
      mode: 'LIVE',
      refillRate: 5,
      interval: '2s',
      max: 5,
    }),
  ],
});

export default aj;