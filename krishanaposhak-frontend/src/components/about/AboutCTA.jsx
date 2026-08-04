import { memo } from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { FiShoppingBag, FiArrowRight } from 'react-icons/fi';

const AboutCTA = memo(function AboutCTA() {
  return (
    <section className="py-12 bg-gradient-to-r from-amber-950 via-stone-900 to-amber-900 text-white font-display">
      <div className="container-page max-w-4xl mx-auto px-4 text-center space-y-4">
        <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
          Ready to Adorn Your Deity with Regal Meerut Poshaks?
        </h3>
        <p className="text-xs sm:text-sm text-stone-300 font-body max-w-md mx-auto">
          Explore our handcrafted collections featuring Size 0 to Size 6+ dresses with live shipping updates across India.
        </p>
        <div className="pt-2 flex justify-center">
          <Link to={ROUTE_PATHS.SHOP}>
            <Button
              variant="primary"
              size="lg"
              leftIcon={<FiShoppingBag className="h-5 w-5 text-amber-200" />}
              rightIcon={<FiArrowRight className="h-5 w-5 text-amber-200" />}
              className="rounded-2xl bg-amber-600 hover:bg-amber-700 text-amber-950 font-bold px-8 shadow-xl border border-amber-400/30 min-h-[48px]"
            >
              Browse Shop Collection
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
});

export default AboutCTA;
