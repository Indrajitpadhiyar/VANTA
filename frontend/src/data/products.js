import {
  heroModel,
  hoodieImg,
  sneakersImg,
  hoodieModelImg,
  hoodieFlatImg,
  poloContrastImg,
  graphicTeeImg,
  poloTippingImg,
  stripedJacketImg,
} from '../assets';

export const CATEGORIES = ['All', 'Tracksuits', 'Hoodies', 'Footwear'];

export const PRODUCTS = [
  {
    id: 1,
    name: 'Loose Fit Hoodie',
    category: 'Hoodies',
    price: 24.99,
    tag: 'Bestseller',
    color: 'Burgundy Maroon',
    image: hoodieModelImg,
    secondaryImage: hoodieFlatImg,
    detailImage: hoodieModelImg,
    desc: 'Loose-fit sweatshirt hoodie in medium weight cotton-blend fabric with a generous, but not oversized silhouette. Jersey-lined, drawstring hood, dropped shoulders, long sleeves, and a kangaroo pocket. Wide ribbing at cuffs and hem. Soft, brushed inside.',
    gallery: [hoodieModelImg, hoodieFlatImg, hoodieModelImg]
  },
  {
    id: 2,
    name: 'VANTA Signature Heavyweight Fleece Set',
    category: 'Tracksuits',
    price: 145,
    tag: 'Signature',
    color: 'Energetic Orange',
    image: heroModel,
    desc: '450 GSM organic French terry cotton with relaxed dropped-shoulder silhouette.'
  },
  {
    id: 3,
    name: 'VANTA Origins Washed Vintage Hoodie',
    category: 'Hoodies',
    price: 110,
    tag: 'New Drop',
    color: 'Charcoal Black',
    image: hoodieImg,
    desc: 'Garment-dyed washed heavyweight fleece with signature double-layered hood.'
  },
  {
    id: 4,
    name: 'Retro VANTA Court Chunky Sneakers',
    category: 'Footwear',
    price: 135,
    tag: 'Limited',
    color: 'White / Sunset Orange',
    image: sneakersImg,
    desc: 'Premium full-grain leather upper with responsive cushioned gum rubber outsole.'
  }
];

export const RELATED_PRODUCTS = [
  {
    id: 101,
    name: 'Polo with Contrast Trims',
    price: 212,
    originalPrice: 242,
    discount: '-20%',
    rating: 4.0,
    image: poloContrastImg,
    secondaryImage: poloContrastImg,
    detailImage: poloContrastImg,
    category: 'Polos & Tops',
    desc: 'Classic knit polo featuring contrast collar and cuff accents with tailored modern hem.'
  },
  {
    id: 102,
    name: 'Gradient Graphic T-shirt',
    price: 145,
    rating: 3.5,
    image: graphicTeeImg,
    secondaryImage: graphicTeeImg,
    detailImage: graphicTeeImg,
    category: 'Street T-Shirts',
    desc: 'Oversized boxy streetwear t-shirt crafted in 300 GSM combed jersey with gradient graphic motif.'
  },
  {
    id: 103,
    name: 'Polo with Tipping Details',
    price: 180,
    rating: 4.6,
    image: poloTippingImg,
    secondaryImage: poloTippingImg,
    detailImage: poloTippingImg,
    category: 'Minimal Essentials',
    desc: 'Refined pique polo shirt featuring dual tipping stripes on the ribbed collar and sleeve cuffs.'
  },
  {
    id: 104,
    name: 'Striped Jacket',
    price: 120,
    originalPrice: 150,
    discount: '-30%',
    rating: 5.0,
    image: stripedJacketImg,
    secondaryImage: stripedJacketImg,
    detailImage: stripedJacketImg,
    category: 'Outerwear',
    desc: 'Oversized vintage zip track jacket in lightweight water-repellent shell with contrast piping.'
  }
];

export const REVIEWS = [
  {
    id: 1,
    author: 'Alex Mathio',
    rating: 5,
    date: '13 Oct 2026',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    comment: "VANTA's dedication to sustainability and ethical practices resonates strongly with today's consumers, positioning the brand as a responsible choice in the fashion world."
  },
  {
    id: 2,
    author: 'Jordan Hayes',
    rating: 5,
    date: '10 Oct 2026',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    comment: "Incredible fabric density and silhouette. The drape is effortless and the 450 GSM French terry cotton feels luxurious yet ultra-comfortable."
  }
];
