// --- Buscador de Vehículos: JS para index.html ---
document.addEventListener('DOMContentLoaded', function() {
  let marcasSeleccionadas = [];
  let modelosSeleccionados = [];
  // Marcas populares y sistema de chips de marcas
  const marcasPopulares = [
    'Toyota', 'Volkswagen', 'Ford', 'Chevrolet', 'Honda', 'Nissan', 'Hyundai', 'Kia',
    'Renault', 'Mazda', 'Mercedes-Benz', 'BMW', 'Audi', 'Peugeot', 'Fiat', 'Jeep',
    'Suzuki', 'Subaru', 'Mitsubishi', 'Lexus', 'Dodge', 'RAM', 'Chery', 'SEAT',
    'Citroën', 'Volvo', 'Land Rover', 'Mini', 'Porsche', 'Acura', 'Infiniti'
  ];
  function cargarMarcas() {
    const marcasList = document.getElementById('marcas-list');
    if (!marcasList) return;
    marcasList.innerHTML = '';
    marcasPopulares.forEach(marca => {
      const opt = document.createElement('option');
      opt.value = marca;
      marcasList.appendChild(opt);
    });
  }
  cargarMarcas();

  const marcaInput = document.getElementById('vehiculo-marca');
  if (marcaInput) {
    marcaInput.addEventListener('input', async function(e) {
      const marca = e.target.value;
      const modelosList = document.getElementById('modelos-list');
      if (!modelosList) return;
      modelosList.innerHTML = '';
      if(marca.length > 0) {
        try {
          const res = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/${encodeURIComponent(marca)}?format=json`);
          const data = await res.json();
          if(data.Results.length > 0) {
            data.Results.forEach(modelo => {
              const opt = document.createElement('option');
              opt.value = modelo.Model_Name;
              modelosList.appendChild(opt);
            });
          } else {
            const opt = document.createElement('option');
            opt.value = 'Sin modelos encontrados';
            modelosList.appendChild(opt);
          }
        } catch (err) {
          const opt = document.createElement('option');
          opt.value = 'Error cargando modelos';
          modelosList.appendChild(opt);
        }
      }
    });
  }

  // Rellenar selects de años para rango
  const anioDesdeSelect = document.getElementById('vehiculo-anio-desde');
  const anioHastaSelect = document.getElementById('vehiculo-anio-hasta');
  if (anioDesdeSelect && anioHastaSelect) {
    const currentYear = new Date().getFullYear();
    anioDesdeSelect.innerHTML = '<option>Año desde</option>';
    anioHastaSelect.innerHTML = '<option>Año hasta</option>';
    for (let y = currentYear; y >= 1990; y--) {
      const opt1 = document.createElement('option');
      opt1.value = y;
      opt1.textContent = y;
      anioDesdeSelect.appendChild(opt1);
      const opt2 = document.createElement('option');
      opt2.value = y;
      opt2.textContent = y;
      anioHastaSelect.appendChild(opt2);
    }
  }

  // --- Simulación de API de coches de segunda mano ---
  function fetchFakeCochesAPI({ marcas, modelos, anioDesde, anioHasta, tipo, combustible, potencia, precio }) {
    // Array de datos de prueba
    const base = [
      { marca: 'Toyota', modelo: 'Corolla', anio: '2019', precio: '13.500 €', combustible: 'Gasolina', tipo: 'Turismo', potencia: '110 CV', km: 45000 },
      { marca: 'Toyota', modelo: 'Yaris', anio: '2018', precio: '10.900 €', combustible: 'Híbrido', tipo: 'Turismo', potencia: '100 CV', km: 60000 },
      { marca: 'Ford', modelo: 'Focus', anio: '2020', precio: '15.200 €', combustible: 'Diésel', tipo: 'Turismo', potencia: '120 CV', km: 38000 },
      { marca: 'BMW', modelo: 'Serie 1', anio: '2017', precio: '16.800 €', combustible: 'Gasolina', tipo: 'Compacto', potencia: '136 CV', km: 52000 },
      { marca: 'Seat', modelo: 'Ibiza', anio: '2018', precio: '9.800 €', combustible: 'Gasolina', tipo: 'Turismo', potencia: '90 CV', km: 70000 },
      { marca: 'Renault', modelo: 'Clio', anio: '2019', precio: '11.500 €', combustible: 'Gasolina', tipo: 'Turismo', potencia: '75 CV', km: 48000 },
      { marca: 'Volkswagen', modelo: 'Golf', anio: '2021', precio: '19.900 €', combustible: 'Gasolina', tipo: 'Turismo', potencia: '130 CV', km: 21000 },
      { marca: 'Peugeot', modelo: '208', anio: '2020', precio: '13.200 €', combustible: 'Gasolina', tipo: 'Turismo', potencia: '100 CV', km: 35000 },
      { marca: 'Kia', modelo: 'Ceed', anio: '2019', precio: '12.700 €', combustible: 'Diésel', tipo: 'Turismo', potencia: '115 CV', km: 41000 },
      { marca: 'Hyundai', modelo: 'i30', anio: '2018', precio: '11.900 €', combustible: 'Gasolina', tipo: 'Turismo', potencia: '100 CV', km: 65000 }
    ];
    // Filtrado simple por los filtros recibidos
    return base.filter(coche =>
      (!marcas.length || marcas.includes(coche.marca)) &&
      (!modelos.length || modelos.includes(coche.modelo)) &&
      (!anioDesde || parseInt(coche.anio) >= parseInt(anioDesde)) &&
      (!anioHasta || parseInt(coche.anio) <= parseInt(anioHasta)) &&
      (!tipo || coche.tipo === tipo) &&
      (!combustible || coche.combustible === combustible) &&
      (!potencia || parseInt(coche.potencia) >= parseInt(potencia)) &&
      (!precio || parseInt(coche.precio.replace(/\D/g, '')) <= parseInt(precio.replace(/\D/g, '') || 999999))
    );
  }

  const form = document.getElementById('vehiculo-search-form');
  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      // Solo ejecuta la búsqueda si el submit viene del botón de búsqueda
      const submitter = e.submitter || document.activeElement;
      if (!submitter || !submitter.classList.contains('results-btn')) return;
      // Recoge filtros seleccionados
      const marcas = marcasSeleccionadas;
      const modelos = modelosSeleccionados;
      const anioDesdeRaw = document.getElementById('vehiculo-anio-desde')?.value;
      const anioHastaRaw = document.getElementById('vehiculo-anio-hasta')?.value;
      const tipoRaw = document.getElementById('vehiculo-tipo')?.value;
      const combustibleRaw = document.getElementById('vehiculo-combustible')?.value;
      const potenciaRaw = document.getElementById('vehiculo-potencia')?.value;
      const precioRaw = document.getElementById('vehiculo-precio')?.value;
      // Normalizar selects con placeholder
      const anioDesde = (anioDesdeRaw && anioDesdeRaw !== 'Año desde') ? anioDesdeRaw : '';
      const anioHasta = (anioHastaRaw && anioHastaRaw !== 'Año hasta') ? anioHastaRaw : '';
      const tipo = (tipoRaw && tipoRaw !== 'Tipo') ? tipoRaw : '';
      const combustible = (combustibleRaw && combustibleRaw !== 'Combustible') ? combustibleRaw : '';
      const potencia = potenciaRaw || '';
      const precio = precioRaw || '';
      const resultDiv = document.getElementById('vehiculo-result');
      // Llama a la función simulada
      const resultados = fetchFakeCochesAPI({ marcas, modelos, anioDesde, anioHasta, tipo, combustible, potencia, precio });
      if (resultados.length === 0) {
        resultDiv.innerHTML = '<p>No se encontraron resultados.</p>';
        return;
      }
      // Renderiza resultados
      resultDiv.innerHTML = '<h3>Resultados de segunda mano:</h3>' +
        resultados.map(r => `
          <div class="result-card">
            <b>${r.marca} ${r.modelo !== '-' ? r.modelo : ''}</b> - ${r.anio}<br>
            <span>Precio: <b>${r.precio}</b></span> | Km: ${r.km}<br>
            <span>${r.combustible} | ${r.tipo} | ${r.potencia}</span>
          </div>
        `).join('');
    });
  }

  // --- Añadir filtros seleccionados al input principal ---
  const mainInput = document.getElementById('vehiculo-marca-modelo');
  const filterSelectors = [
    '#filtro-precio', '#filtro-cuota', '#filtro-km', '#vehiculo-anio', '#filtro-provincia', '#filtro-plazas',
    '#vehiculo-combustible', '#vehiculo-potencia', '#filtro-cambio', '#filtro-puertas', '#filtro-vendedor'
  ];
  const colorButtons = document.querySelectorAll('.color-circle');
  const typeButtons = document.querySelectorAll('.type-btn');
  const distintivoButtons = document.querySelectorAll('.distintivo-circle');
  const reservableSwitch = document.querySelector('.reservable-filter input[type="checkbox"]');

  function getSelectedFilters() {
    const selected = [];
    // Marcas seleccionadas como chips
    marcasSeleccionadas.forEach(marca => selected.push(marca));
    // Modelos seleccionados como chips
    modelosSeleccionados.forEach(modelo => selected.push(modelo));
    filterSelectors.forEach(sel => {
      const el = document.querySelector(sel);
      if (el && el.value && el.value !== el.options[0]?.text) {
        selected.push(el.value);
      }
    });
    // Colores
    document.querySelectorAll('.color-circle.selected').forEach(btn => {
      selected.push(btn.title);
    });
    // Tipos
    document.querySelectorAll('.type-btn.selected').forEach(btn => {
      selected.push(btn.title);
    });
    // Distintivos
    document.querySelectorAll('.distintivo-circle.selected').forEach(btn => {
      selected.push(btn.title);
    });
    // Reservable
    if (reservableSwitch && reservableSwitch.checked) selected.push('Reservables');
    return selected;
  }

  // --- Chips dentro del input principal ---
  function renderChipsInsideInput() {
    const chipsContainer = document.getElementById('search-chips-input');
    if (!chipsContainer || !mainInput) return;
    // Elimina chips previos
    chipsContainer.querySelectorAll('.chip').forEach(e => e.remove());
    // Chips de marcas
    marcasSeleccionadas.forEach(marca => {
      const chip = document.createElement('span');
      chip.className = 'chip';
      chip.setAttribute('data-chip', marca);
      chip.innerHTML = `${marca}<button type="button" class="chip-remove" title="Quitar">×</button>`;
      chipsContainer.insertBefore(chip, mainInput);
      chip.querySelector('.chip-remove').addEventListener('click', function(e) {
        e.stopPropagation();
        marcasSeleccionadas = marcasSeleccionadas.filter(m => m !== marca);
        renderChipsInsideInput();
      });
    });
    // Chips de modelos
    modelosSeleccionados.forEach(modelo => {
      const chip = document.createElement('span');
      chip.className = 'chip';
      chip.setAttribute('data-chip', modelo);
      chip.innerHTML = `${modelo}<button type="button" class="chip-remove" title="Quitar">×</button>`;
      chipsContainer.insertBefore(chip, mainInput);
      chip.querySelector('.chip-remove').addEventListener('click', function(e) {
        e.stopPropagation();
        modelosSeleccionados = modelosSeleccionados.filter(m => m !== modelo);
        renderChipsInsideInput();
      });
    });
    // Chips de otros filtros
    const selected = getSelectedFilters().filter(f => !marcasSeleccionadas.includes(f) && !modelosSeleccionados.includes(f));
    for (let i = 0; i < selected.length; i++) {
      let filtro = selected[i];
      const chip = document.createElement('span');
      chip.className = 'chip';
      chip.setAttribute('data-chip', filtro);
      chip.innerHTML = `${filtro}<button type="button" class="chip-remove" title="Quitar">×</button>`;
      chipsContainer.insertBefore(chip, mainInput);
      chip.querySelector('.chip-remove').addEventListener('click', function(e) {
        e.stopPropagation();
        removeFilterByValue(filtro);
        renderChipsInsideInput();
      });
    }
    // Ajusta el input para que siempre esté al final
    chipsContainer.appendChild(mainInput);
    mainInput.style.display = 'inline-block';
    mainInput.style.width = 'auto';
    mainInput.style.minWidth = '120px';
    // No sobrescribir el valor del input mientras se escribe
  }

  // updateMainInput debe llamar a renderChipsInsideInput
  function updateMainInput() {
    renderChipsInsideInput();
  }

  // Guardar el valor base cuando el usuario escribe
  if (mainInput) {
    mainInput.addEventListener('input', function(e) {
      mainInput.setAttribute('data-base', e.target.value);
      // No llamar a updateMainInput aquí para no sobrescribir mientras se escribe
    });
  }

  // Inicializar chips al cargar
  renderChipsInsideInput();

  // Marcar selección en color, tipo, distintivo
  colorButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      if (btn.classList.contains('selected')) {
        btn.classList.remove('selected');
        // Solo llama si realmente estaba marcado
        if (getSelectedFilters().includes(btn.title)) {
          removeFilterByValue(btn.title);
        } else {
          updateMainInput();
        }
      } else {
        btn.classList.add('selected');
        updateMainInput();
      }
    });
  });
  typeButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      if (btn.classList.contains('selected')) {
        btn.classList.remove('selected');
        if (getSelectedFilters().includes(btn.title)) {
          removeFilterByValue(btn.title);
        } else {
          updateMainInput();
        }
      } else {
        btn.classList.add('selected');
        updateMainInput();
      }
    });
  });
  distintivoButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      if (btn.classList.contains('selected')) {
        btn.classList.remove('selected');
        if (getSelectedFilters().includes(btn.title)) {
          removeFilterByValue(btn.title);
        } else {
          updateMainInput();
        }
      } else {
        btn.classList.add('selected');
        updateMainInput();
      }
    });
  });
  if (reservableSwitch) {
    reservableSwitch.addEventListener('change', updateMainInput);
  }
  // Selects
  filterSelectors.forEach(sel => {
    const el = document.querySelector(sel);
    if (el) el.addEventListener('change', updateMainInput);
  });

  function removeFilterByValue(filtro) {
    // Deseleccionar en selects
    filterSelectors.forEach(sel => {
      const el = document.querySelector(sel);
      if (el && el.value === filtro) {
        el.selectedIndex = 0;
        el.dispatchEvent(new Event('change'));
      }
    });
    // Deseleccionar color
    colorButtons.forEach(btn => {
      if (btn.title === filtro) btn.classList.remove('selected');
    });
    // Deseleccionar tipo
    typeButtons.forEach(btn => {
      if (btn.title === filtro) btn.classList.remove('selected');
    });
    // Deseleccionar distintivo
    distintivoButtons.forEach(btn => {
      if (btn.title === filtro) btn.classList.remove('selected');
    });
    // Deseleccionar reservable
    if (filtro === 'Reservables' && reservableSwitch) {
      reservableSwitch.checked = false;
      reservableSwitch.dispatchEvent(new Event('change'));
    }
    // No llamar a updateMainInput aquí
  }

  // --- Mejorar listado de marcas seleccionables y chips ---
  if (mainInput) {
    // Autocompletado de marcas populares
    mainInput.addEventListener('input', function(e) {
      const val = e.target.value.trim();
      const datalist = document.getElementById('marcas-list');
      if (datalist) {
        datalist.innerHTML = '';
        if (val.length > 0) {
          marcasPopulares.filter(m => m.toLowerCase().includes(val.toLowerCase())).forEach(marca => {
            const opt = document.createElement('option');
            opt.value = marca;
            datalist.appendChild(opt);
          });
        } else {
          marcasPopulares.forEach(marca => {
            const opt = document.createElement('option');
            opt.value = marca;
            datalist.appendChild(opt);
          });
        }
      }
    });
    // Permite añadir marca como chip al seleccionar con ratón una sugerencia
    mainInput.addEventListener('change', async function(e) {
      const val = mainInput.value.trim();
      if (!val) return;
      if (marcasSeleccionadas.includes(val)) {
        // Feedback visual: input rojo y placeholder temporal
        mainInput.value = '';
        mainInput.classList.add('input-error');
        const prevPlaceholder = mainInput.placeholder;
        mainInput.placeholder = 'Marca ya añadida';
        // Resetear datalist de marcas
        const datalist = document.getElementById('marcas-list');
        if (datalist) {
          datalist.innerHTML = '';
          marcasPopulares.forEach(marca => {
            const opt = document.createElement('option');
            opt.value = marca;
            datalist.appendChild(opt);
          });
        }
        setTimeout(() => {
          mainInput.classList.remove('input-error');
          mainInput.placeholder = prevPlaceholder;
        }, 1200);
        return;
      }
      marcasSeleccionadas.push(val);
      mainInput.value = '';
      mainInput.setAttribute('data-base', '');
      // Resetear datalist de marcas
      const datalist = document.getElementById('marcas-list');
      if (datalist) {
        datalist.innerHTML = '';
        marcasPopulares.forEach(marca => {
          const opt = document.createElement('option');
          opt.value = marca;
          datalist.appendChild(opt);
        });
      }
      renderChipsInsideInput();
      // --- Cargar modelos para la marca añadida ---
      const modeloInput = document.getElementById('vehiculo-modelo');
      const modelosList = document.getElementById('modelos-list');
      if (modeloInput) modeloInput.value = '';
      if (modelosList) {
        modelosList.innerHTML = '';
        try {
          const res = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/${encodeURIComponent(val)}?format=json`);
          const data = await res.json();
          if (data.Results && data.Results.length > 0) {
            const modelosUnicos = Array.from(new Set(data.Results.map(m => m.Model_Name)));
            modelosUnicos.forEach(modelo => {
              const opt = document.createElement('option');
              opt.value = modelo;
              modelosList.appendChild(opt);
            });
          } else {
            const opt = document.createElement('option');
            opt.value = 'Sin modelos encontrados';
            modelosList.appendChild(opt);
          }
        } catch (err) {
          const opt = document.createElement('option');
          opt.value = 'Error cargando modelos';
          modelosList.appendChild(opt);
        }
      }
    });
    // Permite añadir marca personalizada como chip al presionar Enter
    mainInput.addEventListener('keydown', async function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        const val = mainInput.value.trim();
        if (val && !marcasSeleccionadas.includes(val)) {
          marcasSeleccionadas.push(val);
          mainInput.value = '';
          mainInput.setAttribute('data-base', '');
          renderChipsInsideInput();
          // --- Cargar modelos para la marca añadida ---
          const modeloInput = document.getElementById('vehiculo-modelo');
          const modelosList = document.getElementById('modelos-list');
          if (modeloInput) modeloInput.value = '';
          if (modelosList) {
            modelosList.innerHTML = '';
            try {
              const res = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/${encodeURIComponent(val)}?format=json`);
              const data = await res.json();
              if (data.Results && data.Results.length > 0) {
                // Evita duplicados en el datalist
                const modelosUnicos = Array.from(new Set(data.Results.map(m => m.Model_Name)));
                modelosUnicos.forEach(modelo => {
                  const opt = document.createElement('option');
                  opt.value = modelo;
                  modelosList.appendChild(opt);
                });
              } else {
                const opt = document.createElement('option');
                opt.value = 'Sin modelos encontrados';
                modelosList.appendChild(opt);
              }
            } catch (err) {
              const opt = document.createElement('option');
              opt.value = 'Error cargando modelos';
              modelosList.appendChild(opt);
            }
          }
        }
      }
    });
  }
  // Permitir añadir modelo como chip al pulsar Enter en el input de modelo
  const modeloInput = document.getElementById('vehiculo-modelo');
  if (modeloInput) {
    // Añadir modelo como chip al pulsar Enter
    modeloInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        const val = modeloInput.value.trim();
        if (val && !modelosSeleccionados.includes(val)) {
          modelosSeleccionados.push(val);
          modeloInput.value = '';
          renderChipsInsideInput();
        }
      }
    });
    // Añadir modelo como chip al seleccionar con ratón una sugerencia
    modeloInput.addEventListener('change', async function(e) {
      const val = modeloInput.value.trim();
      if (!val) return;
      if (modelosSeleccionados.includes(val)) {
        // Feedback visual: input rojo y placeholder temporal
        modeloInput.value = '';
        modeloInput.classList.add('input-error');
        const prevPlaceholder = modeloInput.placeholder;
        modeloInput.placeholder = 'Modelo ya añadido';
        // Resetear datalist de modelos filtrado por la última marca
        const modelosList = document.getElementById('modelos-list');
        if (modelosList && marcasSeleccionadas.length > 0) {
          modelosList.innerHTML = '';
          try {
            const ultimaMarca = marcasSeleccionadas[marcasSeleccionadas.length - 1];
            const res = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/${encodeURIComponent(ultimaMarca)}?format=json`);
            const data = await res.json();
            if (data.Results && data.Results.length > 0) {
              const modelosUnicos = Array.from(new Set(data.Results.map(m => m.Model_Name)));
              modelosUnicos.forEach(modelo => {
                const opt = document.createElement('option');
                opt.value = modelo;
                modelosList.appendChild(opt);
              });
            } else {
              const opt = document.createElement('option');
              opt.value = 'Sin modelos encontrados';
              modelosList.appendChild(opt);
            }
          } catch (err) {
            const opt = document.createElement('option');
            opt.value = 'Error cargando modelos';
            modelosList.appendChild(opt);
          }
        }
        setTimeout(() => {
          modeloInput.classList.remove('input-error');
          modeloInput.placeholder = prevPlaceholder;
        }, 1200);
        return;
      }
      modelosSeleccionados.push(val);
      modeloInput.value = '';
      renderChipsInsideInput();
    });
  }

  // Limpiar filtros
  const clearBtn = document.querySelector('.clear-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', function(e) {
      e.preventDefault();
      // Vaciar chips
      marcasSeleccionadas = [];
      modelosSeleccionados = [];
      renderChipsInsideInput();
      // Limpiar inputs
      document.getElementById('vehiculo-marca-modelo').value = '';
      document.getElementById('vehiculo-modelo').value = '';
      // Limpiar selects y datalists
      const selects = document.querySelectorAll('.filters-grid select');
      selects.forEach(sel => sel.selectedIndex = 0);
      // Limpiar inputs numéricos
      const numInputs = document.querySelectorAll('.filters-grid input[type="number"]');
      numInputs.forEach(inp => inp.value = '');
      // Limpiar colores, tipos, distintivos
      document.querySelectorAll('.color-circle.selected, .type-btn.selected, .distintivo-circle.selected').forEach(el => el.classList.remove('selected'));
      // Limpiar reservable
      const reservable = document.querySelector('.reservable-filter input[type="checkbox"]');
      if (reservable) reservable.checked = false;
      // Resetear datalists
      cargarMarcas();
      const modelosList = document.getElementById('modelos-list');
      if (modelosList) modelosList.innerHTML = '';
      // Limpiar resultados
      const resultDiv = document.getElementById('vehiculo-result');
      if (resultDiv) resultDiv.innerHTML = '';
    });
  }
});
/* Añadir en el CSS para el feedback visual */
/* .input-error { border: 1.5px solid #d32f2f !important; background: #fff0f0 !important; } */
/* Añade en tu CSS para .result-card si quieres mejor visual */
/* .result-card { background: #f7fafd; border-radius: 0.7rem; margin: 0.7rem 0; padding: 0.7rem 1rem; box-shadow: 0 1px 4px rgba(40,62,81,0.07); } */

