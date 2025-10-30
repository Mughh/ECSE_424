(function(){
      try{
        const toc = document.getElementById('toc');
        const content = document.getElementById('content');
        if (!toc || !content) return;

        // Build sidebar TOC
        const parts = Array.from(content.querySelectorAll('article.part'));
        const linkMap = new Map();
        parts.forEach(part => {
          const partTitle = part.getAttribute('data-title') || part.id;
          const liPart = document.createElement('li');
          const aPart = document.createElement('a');
          aPart.href = `#${part.id}`;
          aPart.textContent = partTitle;
          liPart.appendChild(aPart);
          toc.appendChild(liPart);
          linkMap.set(part.id, aPart);

          const sections = Array.from(part.querySelectorAll('section'));
          sections.forEach(sec => {
            const li = document.createElement('li');
            li.style.marginLeft = '12px';
            const a = document.createElement('a');
            a.href = `#${sec.id}`;
            const h2 = sec.querySelector('h2');
            a.textContent = h2 ? h2.textContent : sec.id;
            li.appendChild(a);
            toc.appendChild(li);
            linkMap.set(sec.id, a);
          });
        });

        // Robust scroll spy — pick the section closest to top
        const anchors = Array.from(content.querySelectorAll('article.part, article.part section'));
        const links = Array.from(toc.querySelectorAll('a'));
        const setActive = (id) => {
          links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
        };

        const pickCurrent = () => {
          let winner = anchors[0];
          let best = Infinity;
          for (const el of anchors){
            const r = el.getBoundingClientRect();
            const d = Math.abs(r.top - 80); // 80px from top as target line
            if (r.bottom > 80 && d < best){ winner = el; best = d; }
          }
          if (winner) setActive(winner.id);
        };

        let ticking = false;
        const onScroll = () => {
          if (!ticking){
            window.requestAnimationFrame(() => { pickCurrent(); ticking = false; });
            ticking = true;
          }
        };
        document.addEventListener('scroll', onScroll, {passive:true});
        window.addEventListener('resize', onScroll);
        pickCurrent();

        // Highlight immediately when clicking TOC links
        toc.addEventListener('click', (e) => {
          const a = e.target.closest('a[href^="#"]');
          if (!a) return;
          setActive(a.getAttribute('href').slice(1));
        });
      } catch(e){ /* no-op for preview */ }
    })();
