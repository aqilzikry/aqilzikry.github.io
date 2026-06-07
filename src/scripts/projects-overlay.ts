import type { IProject } from '@types';

interface ProjectsPageData {
  projectDataMap: Record<string, IProject>;
  imageUrlMap: Record<string, string>;
}

declare global {
  interface Window {
    __projectCardClickBound?: boolean;
  }
}

function getPageData(): ProjectsPageData | null {
  const el = document.getElementById('projects-page-data');
  if (!el?.textContent) return null;
  try {
    return JSON.parse(el.textContent) as ProjectsPageData;
  } catch {
    return null;
  }
}

export function initProjectsOverlay(): void {
  const pageData = getPageData();
  if (!pageData) return;

  const { projectDataMap, imageUrlMap } = pageData;
  let currentIndex = 0;
  let currentProject: IProject | null = null;

  const showOverlay = (project: IProject): void => {
    currentProject = project;
    currentIndex = 0;

    const overlay = document.getElementById('project-overlay');
    const track = document.getElementById('carousel-track');
    const dotsContainer = document.getElementById('dots-container');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    if (!overlay || !track || !dotsContainer || !prevBtn || !nextBtn) return;

    track.innerHTML = '';
    dotsContainer.innerHTML = '';

    project.images.forEach((image, index) => {
      const imageDiv = document.createElement('div');
      imageDiv.className = 'w-full flex-shrink-0 relative';
      imageDiv.innerHTML = `
        <img
          src="${imageUrlMap[image]}"
          alt="${project.title} - Image ${index + 1}"
          class="w-full h-96 object-contain"
        />
      `;
      track.appendChild(imageDiv);
    });

    if (project.images.length > 1) {
      prevBtn.classList.remove('hidden');
      nextBtn.classList.remove('hidden');
      dotsContainer.classList.remove('hidden');

      project.images.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className =
          'carousel-dot w-3 h-3 rounded-full bg-light/50 hover:bg-light/70 transition-all duration-200';
        dot.setAttribute('data-index', index.toString());
        dot.setAttribute('aria-label', `Go to image ${index + 1}`);
        dot.addEventListener('click', () => goToImage(index));
        dotsContainer.appendChild(dot);
      });
    } else {
      prevBtn.classList.add('hidden');
      nextBtn.classList.add('hidden');
      dotsContainer.classList.add('hidden');
    }

    const titleElement = document.getElementById('overlay-title');
    const linksElement = document.getElementById('overlay-links');
    const descriptionElement = document.getElementById('overlay-description');

    if (!titleElement || !linksElement || !descriptionElement) return;

    if (project.liveUrl) {
      titleElement.innerHTML = `
        <a
          href="${project.liveUrl}"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 dark:text-light hover:text-accent transition-colors duration-200"
        >
          ${project.title}
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15,3 21,3 21,9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
        </a>
      `;
    } else {
      titleElement.textContent = project.title;
    }

    linksElement.innerHTML = '';
    if (project.githubUrl) {
      linksElement.innerHTML += `
        <a
          href="${project.githubUrl}"
          target="_blank"
          rel="noopener noreferrer"
          class="dark:text-light hover:text-accent transition-colors duration-200"
          aria-label="View on GitHub"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
          </svg>
        </a>
      `;
    }
    if (project.liveUrl) {
      linksElement.innerHTML += `
        <a
          href="${project.liveUrl}"
          target="_blank"
          rel="noopener noreferrer"
          class="text-text-muted dark:text-light hover:text-accent transition-colors duration-200"
          aria-label="View live site"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M15 7h3a5 5 0 0 1 5 5 5 5 0 0 1-5 5h-3m-6 0H6a5 5 0 0 1-5-5 5 5 0 0 1 5-5h3" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
        </a>
      `;
    }

    descriptionElement.textContent = project.description;

    overlay.classList.remove('hidden');
    overlay.classList.add('flex');

    updateCarousel();
  };

  const updateCarousel = (): void => {
    if (!currentProject) return;

    const track = document.getElementById('carousel-track');
    const dots = document.querySelectorAll('.carousel-dot');

    if (track) {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    dots.forEach((dot, index) => {
      if (index === currentIndex) {
        dot.classList.add('bg-accent');
        dot.classList.remove('bg-light/50');
      } else {
        dot.classList.remove('bg-accent');
        dot.classList.add('bg-light/50');
      }
    });
  };

  const nextImage = (): void => {
    if (!currentProject) return;
    currentIndex = (currentIndex + 1) % currentProject.images.length;
    updateCarousel();
  };

  const prevImage = (): void => {
    if (!currentProject) return;
    currentIndex = (currentIndex - 1 + currentProject.images.length) % currentProject.images.length;
    updateCarousel();
  };

  const goToImage = (index: number): void => {
    currentIndex = index;
    updateCarousel();
  };

  const hideOverlay = (): void => {
    const overlay = document.getElementById('project-overlay');
    if (!overlay) return;
    overlay.classList.add('hidden');
    overlay.classList.remove('flex');
    currentProject = null;
  };

  const handleProjectCardClick = (event: MouseEvent): void => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const card = target.closest('.project-card');
    if (!card) return;
    const projectId = card.getAttribute('data-project-id');
    if (!projectId) return;
    const projectData = projectDataMap[projectId];
    if (!projectData) return;
    showOverlay(projectData);
  };

  const handleOverlayBackdropClick = (e: MouseEvent): void => {
    if (e.target === e.currentTarget) hideOverlay();
  };

  const handleKeyboardNavigation = (e: KeyboardEvent): void => {
    const overlay = document.getElementById('project-overlay');
    if (!overlay || overlay.classList.contains('hidden')) return;
    switch (e.key) {
      case 'ArrowLeft':
        prevImage();
        break;
      case 'ArrowRight':
        nextImage();
        break;
      case 'Escape':
        hideOverlay();
        break;
    }
  };

  if (!window.__projectCardClickBound) {
    window.__projectCardClickBound = true;
    document.addEventListener('click', handleProjectCardClick);
  }

  window.onPageLoad?.('project-overlay', () => {
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const closeBtn = document.getElementById('close-overlay');
    const overlay = document.getElementById('project-overlay');
    if (!nextBtn || !prevBtn || !closeBtn || !overlay) return;

    nextBtn.addEventListener('click', nextImage);
    prevBtn.addEventListener('click', prevImage);
    closeBtn.addEventListener('click', hideOverlay);
    overlay.addEventListener('click', handleOverlayBackdropClick);
    document.addEventListener('keydown', handleKeyboardNavigation);

    return () => {
      nextBtn.removeEventListener('click', nextImage);
      prevBtn.removeEventListener('click', prevImage);
      closeBtn.removeEventListener('click', hideOverlay);
      overlay.removeEventListener('click', handleOverlayBackdropClick);
      document.removeEventListener('keydown', handleKeyboardNavigation);
    };
  });
}
