import React from 'react';
import { Button } from './ui/button';

type LevelCardProps = {
  title: string;
  description: string;
  image: string;
  levels: string;
  learners: string;
  price: string;
  discountPrice?: string;
  isDemoAvailable: boolean;
  buttonText: string;
  isPreOrder?: boolean;
};

const LevelCard: React.FC<LevelCardProps> = ({
  title,
  description,
  image,
  levels,
  learners,
  price,
  discountPrice,
  isDemoAvailable,
  buttonText,
  isPreOrder,
}) => {
  return (
    <div className=" text-white bg-slate-600 rounded-lg shadow-md p-6 relative">
      <img
        src={image}
        alt={title}
        className="w-full h-40 object-cover rounded-t-lg"
      />
      {isPreOrder && (
        <span className="absolute top-4 right-4 bg-yellow-400 text-black text-xs font-bold rounded-full px-2 py-1">
          Pre-order SALE 🎉
        </span>
      )}
      <h3 className="text-xl font-bold mt-4">{title}</h3>
      <p className="text-sm text-gray-400 mt-2">{description}</p>
      <div className="flex justify-between items-center mt-4">
        <span className="text-sm">{levels}</span>
        <span className="text-sm">{learners}</span>
      </div>
      <div className="mt-4">
        {discountPrice ? (
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold line-through text-gray-500">
              {price}
            </span>
            <span className="text-lg font-bold text-yellow-400">
              {discountPrice}
            </span>
          </div>
        ) : (
          <span className="text-lg font-bold">{price}</span>
        )}
      </div>
      {isDemoAvailable && (
        <a
          href="#"
          className="text-blue-500 underline mt-4 inline-block"
        >
          Demo
        </a>
      )}
      <Button className="mt-4 w-full  text-white py-2 rounded-md" variant="primary">
        {buttonText}
      </Button>
    </div>
  );
};

const Levels = () => {
  const levelData = [
    {
      title: 'Beginner Levels',
      description:
        'Start your journey here by learning the basics of JavaScript and commonly used methods.',
      image: '/panda1.webp', // replace with your actual images
      levels: '70+ Fun levels',
      learners: '2000+ Learners',
      price: 'Rs 500/month',
      isDemoAvailable: false,
      buttonText: 'Buy for Rs 500/month',
    },
    {
      title: 'Intermediate Levels',
      description:
        'Move a step forward and become a master of JS layouts with fun new levels.',
      image: '/panda2.webp',
      levels: '200+ Fun levels',
      learners: '50+ Learners',
      price: 'Rs 2000',
      discountPrice: 'Rs 1000/month',
      isDemoAvailable: false,
      buttonText: 'Buy for Rs 1000/month',
      isPreOrder: true,
    },
    {
      title: 'Expert Levels',
      description:
        'Learn advanced JS concepts and how to use them effectively.',
      image: '/panda3.webp',
      levels: '',
      learners: '',
      price: 'Coming soon!',
      isDemoAvailable: false,
      buttonText: 'Notify Me',
    },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {levelData.map((level, index) => (
        <LevelCard key={index} {...level} />
      ))}
    </div>
  );
};

export default Levels;
