// Fano Plane Interactive SVG
document.addEventListener('DOMContentLoaded', () => {
  const fano = document.getElementById('fanoMain');
  if (!fano) return;

  const vertices = fano.querySelectorAll('.fano-vertex');
  const lines = fano.querySelectorAll('.fano-line');

  // Gate mapping: vertex data-gate → URL (only gates 1-4 have pages)
  const gateMap = {
    '1': '/gates/part1.html',
    '2': '/gates/part2.html',
    '3': '/gates/part3.html',
    '4': '/gates/part4.html',
  };

  // Correct Fano plane line-vertex adjacency (each line passes through exactly 3 points)
  // P1(100,25)=gate1, P2(34,155)=gate2, P3(166,155)=gate3
  // P4(67,90)=gate4, P5(133,90)=gate5, P6(100,155)=gate6, P7(100,112)=gate7
  const lineVertexMap = {
    '1': ['1', '2', '4'],     // Left edge: P1-P4-P2
    '2': ['1', '3', '5'],     // Right edge: P1-P5-P3
    '3': ['2', '3', '6'],     // Bottom edge: P2-P6-P3
    '4': ['1', '6', '7'],     // Vertical median: P1-P7-P6
    '5': ['2', '5', '7'],     // Diagonal BL→RM: P2-P7-P5
    '6': ['3', '4', '7'],     // Diagonal BR→LM: P3-P7-P4
    '7': ['4', '5', '6'],     // Inner circle: P4-P5-P6
  };

  vertices.forEach(v => {
    const gate = v.getAttribute('data-gate');

    v.addEventListener('mouseenter', () => {
      // Find all lines containing this vertex
      const connectedLines = [];
      const connectedVerts = new Set([gate]);
      for (const [lineId, verts] of Object.entries(lineVertexMap)) {
        if (verts.includes(gate)) {
          connectedLines.push(lineId);
          verts.forEach(vt => connectedVerts.add(vt));
        }
      }

      // Highlight connected lines, dim others
      lines.forEach(l => {
        const lid = l.getAttribute('data-line');
        if (connectedLines.includes(lid)) {
          l.style.stroke = 'var(--accent)';
          l.style.strokeWidth = '3';
        } else {
          l.style.opacity = '0.2';
        }
      });

      // Dim vertices not on connected lines
      vertices.forEach(v2 => {
        const g2 = v2.getAttribute('data-gate');
        if (!connectedVerts.has(g2)) {
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

    // Click to navigate (only gates 1-4)
    if (gateMap[gate]) {
      v.style.cursor = 'pointer';
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
        const g = v.getAttribute('data-gate');
        v.setAttribute('r', ['1','2','3'].includes(g) ? '7' : g === '7' ? '5' : '6');
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
