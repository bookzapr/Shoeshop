'use client';

import EcommerceLandingHero from '../landing/ecommerce-landing-hero';
import EcommerceLandingBrands from '../landing/ecommerce-landing-brands';
import EcommerceLandingOurProduct from '../landing/ecommerce-landing-our-product';

// ----------------------------------------------------------------------

export default function EcommerceLandingView() {
  return (
    <>
      <EcommerceLandingHero />

      <EcommerceLandingBrands />

      <EcommerceLandingOurProduct />
    </>
  );
}
