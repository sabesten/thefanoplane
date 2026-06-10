// Fano Plane Interactive SVG
document.addEventListener('DOMContentLoaded', () => {
  const fano = document.getElementById('fanoMain');
  if (!fano) return;

  const vertices = fano.querySelectorAll('.fano-vertex');
  const lines = fano.querySelectorAll('.fano-line');

  // Gate mapping: vertex data-gate → URL
  const gateMap = {
    '1': '/gates/part1.html',
    '2': '/gates/part2.html',
    '3': '/gates/part3.html',
    '4': '/gates/part4.html',
  };

  // Line-vertex adjacency for highlighting (standard Fano plane)
  // Lines: 1=left edge, 2=right edge, 3=bottom edge, 4=vertical median, 5=median BL→MR, 6=median BR→ML, 7=inscribed circle
  const lineVertexMap = {
    '1': ['1', '2', '4'],      // left edge: P1—P4—P2
    '2': ['1', '3', '5'],      // right edge: P1—P5—P3
    '3': ['2', '3', '0'],      // bottom edge: P2—P6—P3 (P6=data-gate 0)
    '4': ['1', '0', '0'],      // vertical median: P1—P7—P6 (two 0-gate points)
    '5': ['2', '5', '0'],      // median: P2—P7—P5
    '6': ['3', '4', '0'],      // median: P3—P7—P4
    '7': ['4', '5', '0'],      // inscribed circle: P4—P5—P6
  };

  vertices.forEach(v => {
    const gate = v.getAttribute('data-gate');
    
    v.addEventListener('mouseenter', () => {
      // Highlight lines connected to this vertex
      const connectedLines = [];
      for (const [lineId, verts] of Object.entries(lineVertexMap)) {
        if (verts.includes(gate)) {
          connectedLines.push(lineId);
        }
      }
      lines.forEach(l => {
        const lid = l.getAttribute('data-line');
        if (connectedLines.includes(lid)) {
          l.style.stroke = 'var(--accent)';
          l.style.strokeWidth = '3';
        } else {
          l.style.opacity = '0.2';
        }
      });
      vertices.forEach(v2 => {
        const g2 = v2.getAttribute('data-gate');
        if (!connectedLines.flat().includes(g2) && g2 !== gate) {
          v2.style.opacity = '0.2';
        }
      });
    });

    v.addEventListener('mouseleave', () => {
      lines.forEach(l => {
        l.style.stroke = '';
        l.style.strokeWidth = '';
        l.style.opacity = '';
      });
      vertices.forEach(v2 => {
        v2.style.opacity = '';
      });
    });

    // Click to navigate
    if (gateMap[gate]) {
      v.addEventListener('click', () => {
        window.location.href = gateMap[gate];
      });
    }
  });

  // Gate card hover → highlight corresponding Fano vertex
  const gateCards = document.querySelectorAll('.gate-card');
  gateCards.forEach(card => {
    const gate = card.getAttribute('data-gate');
    card.addEventListener('mouseenter', () => {
      vertices.forEach(v => {
        if (v.getAttribute('data-gate') === gate) {
          v.style.fill = '#fff';
          v.setAttribute('r', '10');
        }
      });
    });
    card.addEventListener('mouseleave', () => {
      vertices.forEach(v => {
        v.style.fill = '';
        v.setAttribute('r', v.getAttribute('data-center') ? '5' : '6');
      });
    });
  });

  // Smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});
