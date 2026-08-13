import { useRef, useEffect, useState } from 'react';

/**
 * Custom hook untuk trigger animasi saat elemen masuk viewport
 * @param options - Intersection Observer options
 * @returns { ref, inView } - ref untuk elemen dan boolean apakah visible
 */
export function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      {
        threshold: 0.1,
        rootMargin: "-60px",
        ...options,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options]);

  return { ref, inView };
}

/**
 * Custom hook untuk fade-in animasi dengan delay
 * @param delay - delay dalam ms (default: 0)
 * @returns { ref, inView } - ref dan visibility state
 */
export function useFadeIn(delay: number = 0) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      {
        threshold: 0.1,
        rootMargin: "-60px",
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [delay]);

  return { ref, isVisible };
}

/**
 * Custom hook untuk multiple animations dengan staggered delays
 * @param count - jumlah elemen
 * @param baseDelay - delay dasar dalam ms (default: 100)
 * @returns array of { ref, isVisible } objects
 */
export function useStaggeredFadeIn(count: number, baseDelay: number = 100) {
  const refs = useRef<(HTMLDivElement | null)[]>(
    Array(count).fill(null)
  );
  const [visibleStates, setVisibleStates] = useState<boolean[]>(
    Array(count).fill(false)
  );

  useEffect(() => {
    const observers = refs.current.map((element, index) => {
      if (!element) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setVisibleStates(prev => {
                const newStates = [...prev];
                newStates[index] = true;
                return newStates;
              });
            }, index * baseDelay);
            observer.unobserve(element);
          }
        },
        {
          threshold: 0.1,
          rootMargin: "-60px",
        }
      );

      observer.observe(element);
      return observer;
    });

    return () => {
      observers.forEach(observer => {
        if (observer) observer.disconnect();
      });
    };
  }, [count, baseDelay]);

  return refs.current.map((ref, index) => ({
    ref,
    isVisible: visibleStates[index],
  }));
}
