export interface Album {
    name: string
    artist: string
    cover: string
    audio?: string
    video?: string
  }
  
  export const listenNowAlbums: Album[] = [
    {
      name: 'Code in My Veins',
      artist: 'Deamoner',
      cover: 'https://cdn2.suno.ai/image_c7b46b4d-4ac2-41f6-b8ed-10096e69850d.jpeg',
      audio: 'https://cdn2.suno.ai/audio_c7b46b4d-4ac2-41f6-b8ed-10096e69850d.mp3',
      video: 'Code in My Veins.mp4'
    },
    {
      name: 'Sudo Bash',
      artist: 'Deamoner',
      cover: 'https://cdn2.suno.ai/image_39ef534d-e9f4-4db5-8f82-22d2b2edaa35.jpeg',
      audio: 'https://cdn2.suno.ai/audio_39ef534d-e9f4-4db5-8f82-22d2b2edaa35.mp3',
      video: 'sudo bash.mp4'
    },
    {
      name: 'Kernel Commandos',
      artist: 'Deamoner',
      cover: 'https://cdn2.suno.ai/image_eb042e47-98fa-451f-8401-9c0762a73466.jpeg',
      audio: 'https://cdn2.suno.ai/audio_eb042e47-98fa-451f-8401-9c0762a73466.mp3',
      video: 'Kernel Kommandos.mp4'
    },
    {
      name: 'Binary Baller',
      artist: 'Deamoner',
      cover: 'https://cdn2.suno.ai/image_b87fa20e-c283-444b-97b3-c5786cb45ae2.jpeg',
      audio: 'https://cdn2.suno.ai/audio_b87fa20e-c283-444b-97b3-c5786cb45ae2.mp3',
      video: 'Binary Baller.mp4'
    },
    {
      name: 'Code Flow',
      artist: 'Deamoner',
      cover: 'https://cdn2.suno.ai/image_4ecc74b5-05c0-4bd0-ae89-85077d1b0065.jpeg',
      audio: 'https://cdn2.suno.ai/audio_4ecc74b5-05c0-4bd0-ae89-85077d1b0065.mp3',
      video: 'Code Flow.mp4'
    },
    {
      name: 'Digital Frontier',
      artist: 'Deamoner',
      cover: 'https://cdn2.suno.ai/image_8f5a4548-84ed-4a41-9bc5-39546feeca6a.jpeg',
      audio: 'https://cdn2.suno.ai/audio_8f5a4548-84ed-4a41-9bc5-39546feeca6a.mp3',
      video: 'Digital Frontier.mp4'
    },
  ]
  
  export const madeForYouAlbums: Album[] = [
    {
      name: 'Thinking Components',
      artist: 'Lena Logic',
      cover: 'https://images.unsplash.com/photo-1615247001958-f4bc92fa6a4a?w=300&dpr=2&q=80',
    },
    {
      name: 'Functional Fury',
      artist: 'Beth Binary',
      cover: 'https://images.unsplash.com/photo-1513745405825-efaf9a49315f?w=300&dpr=2&q=80',
    },
    {
      name: 'React Rendezvous',
      artist: 'Ethan Byte',
      cover: 'https://images.unsplash.com/photo-1614113489855-66422ad300a4?w=300&dpr=2&q=80',
    },
    {
      name: 'Stateful Symphony',
      artist: 'Beth Binary',
      cover: 'https://images.unsplash.com/photo-1446185250204-f94591f7d702?w=300&dpr=2&q=80',
    },
    {
      name: 'Async Awakenings',
      artist: 'Nina Netcode',
      cover: 'https://images.unsplash.com/photo-1468817814611-b7edf94b5d60?w=300&dpr=2&q=80',
    },
    {
      name: 'The Art of Reusability',
      artist: 'Lena Logic',
      cover: 'https://images.unsplash.com/photo-1490300472339-79e4adc6be4a?w=300&dpr=2&q=80',
    },
  ]

  export const albums = [...listenNowAlbums, ...madeForYouAlbums];