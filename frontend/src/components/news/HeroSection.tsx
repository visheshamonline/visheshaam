import { Article } from '@/lib/api';
import ArticleCard from './ArticleCard';

interface Props {
  featured: Article[];
}

export default function HeroSection({ featured }: Props) {
  const hero = featured[0];
  const rightCards = featured.slice(1, 3);

  if (!hero) return null;

  return (
    <section className="mb-10 pb-10 border-b border-[#e7e5e4] dark:border-[#2a2927]">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Large left hero */}
        <div className="lg:col-span-3">
          <ArticleCard article={hero} variant="hero" />
        </div>

        {/* Two stacked right cards */}
        {rightCards.length > 0 && (
          <div className="lg:col-span-2 flex flex-col gap-5">
            {rightCards.map(a => (
              <div key={a.id} className="flex-1">
                <ArticleCard article={a} variant="sub" />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
