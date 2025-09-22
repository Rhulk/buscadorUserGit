// --- Buscador de Vehículos: JS para index.html ---
document.addEventListener('DOMContentLoaded', function() {
  // Marcas populares
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

  const form = document.getElementById('vehiculo-search-form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const marca = document.getElementById('vehiculo-marca').value.trim();
      const modelo = document.getElementById('vehiculo-modelo').value.trim();
      const anio = document.getElementById('vehiculo-anio').value.trim();
      const tipo = document.getElementById('vehiculo-tipo').value;
      const combustible = document.getElementById('vehiculo-combustible').value;
      const potencia = document.getElementById('vehiculo-potencia').value;
      const precio = document.getElementById('vehiculo-precio').value;
      const resultDiv = document.getElementById('vehiculo-result');
      if(marca || modelo || anio || tipo || combustible || potencia || precio) {
        let resumen = `<b>Marca:</b> ${marca || '-'}<br>`;
        resumen += `<b>Modelo:</b> ${modelo || '-'}<br>`;
        resumen += `<b>Año:</b> ${anio || '-'}<br>`;
        resumen += `<b>Tipo:</b> ${tipo ? tipo.charAt(0).toUpperCase() + tipo.slice(1) : '-'}<br>`;
        resumen += `<b>Combustible:</b> ${combustible ? combustible.charAt(0).toUpperCase() + combustible.slice(1) : '-'}<br>`;
        resumen += `<b>Potencia:</b> ${potencia ? potencia + ' HP' : '-'}<br>`;
        resumen += `<b>Precio:</b> ${precio ? '$' + precio : '-'}<br>`;
        resultDiv.innerHTML = `<p>Mostrando resultados para:</p><div>${resumen}</div>`;
      } else {
        resultDiv.innerHTML = '';
      }
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
    const selected = getSelectedFilters();
    // Chips de filtros
    for (let i = 0; i < selected.length; i++) {
      let filtro = selected[i];
      const chip = document.createElement('span');
      chip.className = 'chip';
      chip.setAttribute('data-chip', filtro);
      chip.innerHTML = `${filtro}<button type="button" class="chip-remove" title="Quitar">×</button>`;
      chipsContainer.insertBefore(chip, mainInput);
      chip.querySelector('.chip-remove').addEventListener('click', function(e) {
        e.stopPropagation();
        console.log('Quitar filtro:', filtro); // Depuración
        removeFilterByValue(filtro);
      });
    }
    // Ajusta el input para que siempre esté al final
    chipsContainer.appendChild(mainInput);
    mainInput.style.display = 'inline-block';
    mainInput.style.width = 'auto';
    mainInput.style.minWidth = '120px';
    mainInput.value = mainInput.getAttribute('data-base') || '';
  }

  // updateMainInput debe llamar a renderChipsInsideInput
  function updateMainInput() {
    renderChipsInsideInput();
  }

  // Guardar el valor base cuando el usuario escribe
  if (mainInput) {
    mainInput.addEventListener('input', function(e) {
      mainInput.setAttribute('data-base', e.target.value);
      updateMainInput();
    });
  }

  // Inicializar chips al cargar
  renderChipsInsideInput();

  // Marcar selección en color, tipo, distintivo
  colorButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      btn.classList.toggle('selected');
      updateMainInput();
    });
  });
  typeButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      btn.classList.toggle('selected');
      updateMainInput();
    });
  });
  distintivoButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      btn.classList.toggle('selected');
      updateMainInput();
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
    updateMainInput();
  }
});

