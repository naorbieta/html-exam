import { AnimatePresence, cubicBezier, motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { useOutsideClick } from './hooks/useOutsideClick.js';
import navStyles from './styles/nav.module.css';
import { classNames } from './utils/classnames.js';

const dropdownEasing = cubicBezier(0.4, 0, 0.2, 1);

export function Nav({ lesson: currentLesson, navList }) {
  const menuRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const { prev, next } = currentLesson;

  useOutsideClick(menuRef, () => setShowDropdown(false));

  return (
    <header className="grid grid-cols-1 sm:grid-cols-[auto_minmax(0,1fr)_auto] h-[82px] gap-0.5 py-4 px-1 text-sm">
      <a
        className={classNames(
          'hidden sm:flex cursor-pointer h-full items-center justify-center w-[40px] text-tk-elements-breadcrumbs-navButton-iconColor',
          !prev ? 'opacity-32 pointer-events-none' : 'hover:text-tk-elements-breadcrumbs-navButton-iconColorHover',
        )}
        aria-label="前の試験"
        aria-disabled={!prev}
        href={prev?.href}
      >
        <span className="i-ph-arrow-left scale-120"></span>
      </a>
      <div className="relative">
        <div
          data-state={`${showDropdown ? 'open' : 'closed'}`}
          className={classNames(
            navStyles.NavContainer,
            'absolute mx-4 sm:mx-0 z-1 left-0 right-0 rounded-[8px] border overflow-hidden z-50',
          )}
          ref={menuRef}
        >
          <button
            className={classNames(
              navStyles.ToggleButton,
              'flex-1 flex items-center text-left py-3 px-3 w-full overflow-hidden',
            )}
            aria-expanded={showDropdown}
            aria-haspopup="listbox"
            aria-label="試験を選ぶ"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div className="flex items-center gap-1 font-light truncate">
              <strong className="font-semibold">{currentLesson.data.title}</strong>
            </div>
            <div
              className={classNames(navStyles.ToggleButtonIcon, 'ml-auto w-[30px]', {
                'i-ph-caret-up-bold': showDropdown,
                'i-ph-caret-down-bold': !showDropdown,
              })}
            ></div>
          </button>
          <AnimatePresence>
            {showDropdown && (
              <motion.nav
                initial={{ height: 0, y: 0 }}
                animate={{ height: 'auto', y: 0 }}
                exit={{ height: 0, y: 0 }}
                transition={{ duration: 0.2, ease: dropdownEasing }}
                className=" overflow-hidden transition-theme bg-tk-elements-breadcrumbs-dropdown-backgroundColor"
              >
                <ul
                  className="py-5 pl-5 border-t border-tk-elements-breadcrumbs-dropdown-borderColor overflow-auto max-h-[60dvh]"
                  role="listbox"
                  aria-label="試験の一覧"
                >
                  {navList.map(item => {
                    const isActive = item.id === currentLesson.id;
                    return (
                      <li key={item.id} className="mr-3">
                        <a
                          role="option"
                          aria-selected={isActive}
                          className={classNames(
                            'w-full inline-block border border-transparent pr-3 transition-theme text-tk-elements-breadcrumbs-dropdown-lessonTextColor hover:text-tk-elements-breadcrumbs-dropdown-lessonTextColorHover px-3 py-1 rounded-1',
                            isActive
                              ? 'font-semibold text-tk-elements-breadcrumbs-dropdown-lessonTextColorSelected bg-tk-elements-breadcrumbs-dropdown-lessonBackgroundColorSelected'
                              : 'bg-tk-elements-breadcrumbs-dropdown-lessonBackgroundColor',
                          )}
                          href={item.href}
                        >
                          {item.title}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </div>
      <a
        className={classNames(
          'hidden sm:flex cursor-pointer h-full items-center justify-center w-[40px] text-tk-elements-breadcrumbs-navButton-iconColor',
          !next ? 'opacity-32 pointer-events-none' : 'hover:text-tk-elements-breadcrumbs-navButton-iconColorHover',
        )}
        aria-label="次の試験"
        aria-disabled={!next}
        href={next?.href}
      >
        <span className="i-ph-arrow-right scale-120"></span>
      </a>
    </header>
  );
}
