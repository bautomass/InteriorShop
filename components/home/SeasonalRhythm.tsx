"use client"

import { motion } from 'framer-motion';
import { Cloud, Leaf, Snowflake, Sun } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { memo, useCallback, useState } from 'react';

interface Product {
  name: string;
  price: string;
  image: string;
}

interface Season {
  icon: React.ReactNode;
  title: string;
  accent: string;
  description: string;
  products: Product[];
}

type SeasonKey = 'spring' | 'summer' | 'autumn' | 'winter';

const ProductCard = memo(function ProductCard({ 
  product, 
  index 
}: { 
  product: Product; 
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group cursor-pointer overflow-hidden rounded-xl bg-primary-50"
    >
      <div className="aspect-[3/4] overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          width={300}
          height={400}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading={index < 2 ? "eager" : "lazy"}
        />
      </div>
      <div className="p-4">
        <h4 className="text-primary-900">{product.name}</h4>
        <p className="text-accent-500">{product.price}</p>
      </div>
    </motion.div>
  );
});

const SeasonalRhythm = () => {
  const [activeSeason, setActiveSeason] = useState<SeasonKey>('summer');
  
  const handleSeasonChange = useCallback((season: SeasonKey) => {
    setActiveSeason(season);
  }, []);

  const seasons = {
    spring: {
      icon: <Cloud className="h-6 w-6" />,
      title: "Spring Renewal",
      accent: "bg-[#E1F0C4]",
      description: "Light textures and fresh perspectives",
      products: [
        { name: "Bamboo Room Divider", price: "€890", image: "/api/placeholder/300/400" },
        { name: "Cotton Throw Pillows", price: "€120", image: "/api/placeholder/300/400" },
        { name: "Rattan Side Table", price: "€340", image: "/api/placeholder/300/400" }
      ]
    },
    summer: {
      icon: <Sun className="h-6 w-6" />,
      title: "Summer Serenity",
      accent: "bg-[#FFF5E1]",
      description: "Airy designs for warm days",
      products: [
        { name: "Linen Lounge Chair", price: "€1,290", image: "/api/placeholder/300/400" },
        { name: "Ceramic Planter Set", price: "€180", image: "/api/placeholder/300/400" },
        { name: "Teak Coffee Table", price: "€760", image: "/api/placeholder/300/400" }
      ]
    },
    autumn: {
      icon: <Leaf className="h-6 w-6" />,
      title: "Autumn Harmony",
      accent: "bg-[#F5E6D3]",
      description: "Warm woods and rich textures",
      products: [
        { name: "Walnut Dining Table", price: "€2,190", image: "/api/placeholder/300/400" },
        { name: "Wool Area Rug", price: "€890", image: "/api/placeholder/300/400" },
        { name: "Oak Bookshelf", price: "€1,450", image: "/api/placeholder/300/400" }
      ]
    },
    winter: {
      icon: <Snowflake className="h-6 w-6" />,
      title: "Winter Comfort",
      accent: "bg-[#E6EEF2]",
      description: "Cozy minimalism for cold days",
      products: [
        { name: "Upholstered Bed Frame", price: "€1,890", image: "/api/placeholder/300/400" },
        { name: "Cashmere Throw", price: "€290", image: "/api/placeholder/300/400" },
        { name: "Floor Lamp", price: "€520", image: "/api/placeholder/300/400" }
      ]
    }
  };

  return (
    <section className="bg-primary-50 py-24 dark:bg-primary-900">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-light text-primary-900 dark:text-primary-50">
            Living with the Seasons
          </h2>
          <p className="mt-4 text-lg text-primary-600 dark:text-primary-300">
            Our collections evolve with nature's rhythm
          </p>
        </div>

        <div className="mb-12 flex justify-center gap-4">
          {Object.entries(seasons).map(([season, data]) => (
            <button
              key={season}
              onClick={() => handleSeasonChange(season as SeasonKey)}
              className={`flex items-center gap-2 rounded-full px-6 py-3 transition-all ${
                activeSeason === season
                  ? `${data.accent} text-primary-900`
                  : 'bg-primary-100 text-primary-600 hover:bg-primary-200 dark:bg-primary-800 dark:text-primary-300'
              }`}
            >
              {data.icon}
              <span className="font-medium capitalize">{season}</span>
            </button>
          ))}
        </div>

        <motion.div
          key={activeSeason}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`rounded-3xl ${seasons[activeSeason].accent} p-12`}
        >
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="flex flex-col justify-center">
              <h3 className="mb-4 text-3xl font-light text-primary-900">
                {seasons[activeSeason].title}
              </h3>
              <p className="mb-8 text-lg text-primary-600">
                {seasons[activeSeason].description}
              </p>
              <Link
                href={`/collections/${activeSeason}`}
                className="inline-flex w-fit items-center gap-2 rounded-full bg-primary-900 px-6 py-3 text-sm font-medium text-primary-50 transition-all hover:bg-primary-800"
              >
                View Collection
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {seasons[activeSeason].products.map((product, index) => (
                <ProductCard
                  key={product.name}
                  product={product}
                  index={index}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default memo(SeasonalRhythm);