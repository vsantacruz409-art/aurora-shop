
const CONFIG = {
  whatsapp: '573216051474',
  facebook: 'https://www.facebook.com/',
  tiktok:   'https://www.tiktok.com/',
  envio: 12000,
  gratisDesde: 200000
};

const CATS = { vestidos:'Vestidos', blusas:'Blusas y tops', pantalones:'Pantalones y faldas', abrigos:'Abrigos y chaquetas', zapatos:'Zapatos', accesorios:'Accesorios' };
const TALLAS = { r:['XS','S','M','L','XL'], z:['35','36','37','38','39','40'], u:['Única'] };
/* n=nombre c=categoría p=precio f=nombre del archivo de la foto (img/productos/<f>.jpg) t=tipo de talla e=sello */
const PRODUCTOS = [
  {id:1, n:'Vestido floral de verano', c:'vestidos', p:99900,  f:'vestido-floral-verano', e:'Nuevo'},
  {id:2, n:'Vestido de noche negro',   c:'vestidos', p:189900, f:'vestido-noche-negro'},
  {id:3, n:'Vestido midi casual',      c:'vestidos', p:119900, f:'vestido-midi-casual', e:'Oferta'},
  {id:4, n:'Blusa de lino blanca',     c:'blusas',   p:64900,  f:'blusa-lino-blanca'},
  {id:5, n:'Camiseta básica de algodón', c:'blusas', p:39900,  f:'camiseta-basica-algodon', e:'Más vendido'},
  {id:6, n:'Top satinado rosa',        c:'blusas',   p:74900,  f:'top-satinado-rosa'},
  {id:7, n:'Jeans tiro alto',          c:'pantalones', p:129900, f:'jeans-tiro-alto', e:'Más vendido'},
  {id:8, n:'Pantalón palazzo',         c:'pantalones', p:99900,  f:'pantalon-palazzo'},
  {id:9, n:'Falda plisada',            c:'pantalones', p:84900,  f:'falda-plisada'},
  {id:10,n:'Abrigo largo de otoño',    c:'abrigos',  p:249900, f:'abrigo-largo-otono', e:'Temporada'},
  {id:11,n:'Blazer de oficina',        c:'abrigos',  p:219900, f:'blazer-oficina'},
  {id:12,n:'Chaqueta de jean',         c:'abrigos',  p:149900, f:'chaqueta-jean'},
  {id:13,n:'Tenis blancos urbanos',    c:'zapatos',  p:159900, f:'tenis-blancos-urbanos', t:'z', e:'Nuevo'},
  {id:14,n:'Tacones elegantes',        c:'zapatos',  p:179900, f:'tacones-elegantes', t:'z'},
  {id:15,n:'Sandalias de verano',      c:'zapatos',  p:89900,  f:'sandalias-verano', t:'z', e:'Oferta'},
  {id:16,n:'Bolso de cuero',           c:'accesorios', p:139900, f:'bolso-cuero', t:'u'},
  {id:17,n:'Gafas de sol',             c:'accesorios', p:59900,  f:'gafas-sol', t:'u'},
  {id:18,n:'Bufanda tejida',           c:'accesorios', p:49900,  f:'bufanda-tejida', t:'u', e:'Temporada'}
];
const DESTACADOS = [1,2,7,10,13,16,11,5];

const $  = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const fmt = n => '$' + n.toLocaleString('es-CO');
const foto = p => `img/productos/${p.f}.jpg`;   // las fotos viven en la carpeta img/ del proyecto
const prod = id => PRODUCTOS.find(p => p.id === +id);
const leer = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const guardar = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

let carrito = leer('aurora_carrito', []);
let favs = leer('aurora_favs', []);

function toast(msg) {
  const a = $('#aviso'); a.textContent = msg; a.classList.add('on');
  clearTimeout(toast.t); toast.t = setTimeout(() => a.classList.remove('on'), 2200);
}

function montar() {
  const enTienda = /tienda/.test(location.pathname);
  $('#header').outerHTML = `
  <header>
    <a class="logo" href="index.html">Aurora</a>
    <nav>
      <a href="index.html" class="${enTienda ? '' : 'on'}">Inicio</a>
      <a href="tienda.html" class="${enTienda ? 'on' : ''}">Tienda</a>
      <a href="index.html#nosotras">Nosotras</a>
      <a href="index.html#redes">Redes</a>
      <a href="index.html#contacto">Contacto</a>
    </nav>
    <div class="iconos">
      <button class="ico" data-favoritos aria-label="Ver favoritas">♥<b id="cont-fav">0</b></button>
      <button class="ico" data-carrito aria-label="Abrir carrito">🛍<b id="cont-car">0</b></button>
    </div>
  </header>`;

  $('#footer').outerHTML = `
  <footer>
    <div class="pie">
      <div><h4>Aurora</h4><p>Moda femenina cómoda, elegante y con personalidad.</p></div>
      <div><h4>Compra</h4><a href="tienda.html">Toda la tienda</a><a href="tienda.html?cat=vestidos">Vestidos</a><a href="tienda.html?cat=zapatos">Zapatos</a></div>
      <div><h4>Contacto</h4><a data-wa target="_blank" rel="noopener">WhatsApp 321 605 1474</a><a data-fb target="_blank" rel="noopener">Facebook</a><a data-tt target="_blank" rel="noopener">TikTok</a></div>
      <div><h4>Pagos</h4><p>Tarjeta · PSE · Nequi / Daviplata · Contra entrega</p></div>
    </div>
    <p class="copy">© 2026 Aurora · Moda Femenina</p>
  </footer>`;

  document.body.insertAdjacentHTML('beforeend', `
  <div class="velo" id="velo"></div>
  <aside class="panel" id="panel" aria-label="Carrito de compras">
    <div class="panel-cab"><h3>Tu carrito</h3><button class="cerrar" data-cerrar aria-label="Cerrar">×</button></div>
    <div id="items"></div>
    <div class="panel-pie" id="pie-carrito"></div>
  </aside>
  <div class="modal" id="modal"><div class="caja"><button class="cerrar" data-cerrar aria-label="Cerrar">×</button><div id="modal-cont"></div></div></div>
  <a class="wa-flotante" data-wa target="_blank" rel="noopener" aria-label="Escríbenos por WhatsApp"><span>💬</span><b>WhatsApp</b></a>
  <div class="aviso" id="aviso" role="status"></div>`);

  // Enlaces de WhatsApp y redes
  const hola = encodeURIComponent('Hola Aurora, quiero información sobre sus prendas.');
  $$('[data-wa]').forEach(a => a.href = `https://wa.me/${CONFIG.whatsapp}?text=${hola}`);
  $$('[data-fb]').forEach(a => a.href = CONFIG.facebook);
  $$('[data-tt]').forEach(a => a.href = CONFIG.tiktok);
}

/* ---------- Tarjeta de producto ---------- */
const tarjeta = p => `
  <article class="tarjeta">
    <div class="foto">
      <img loading="lazy" src="${foto(p)}" alt="${p.n}" data-ph="${p.n}">
      ${p.e ? `<span class="sello">${p.e}</span>` : ''}
      <button class="corazon ${favs.includes(p.id) ? 'activo' : ''}" data-fav="${p.id}" aria-label="Marcar favorita">♥</button>
    </div>
    <div class="info">
      <span class="etiqueta">${CATS[p.c]}</span>
      <h3>${p.n}</h3>
      <p class="precio">${fmt(p.p)}</p>
      <div class="acciones">
        <select aria-label="Talla">${TALLAS[p.t || 'r'].map(t => `<option>${t}</option>`).join('')}</select>
        <button class="boton peq" data-add="${p.id}">Agregar</button>
      </div>
    </div>
  </article>`;

/* ---------- Carrito ---------- */
function totales() {
  const sub = carrito.reduce((s, i) => s + prod(i.id).p * i.q, 0);
  const env = !sub || sub >= CONFIG.gratisDesde ? 0 : CONFIG.envio;
  return { sub, env, total: sub + env };
}
function agregar(id, talla) {
  const it = carrito.find(i => i.id == id && i.talla === talla);
  it ? it.q++ : carrito.push({ id: +id, talla, q: 1 });
  actualizar(); toast('Agregada al carrito 🛍️');
}
function cambiarQ(idx, d) {
  carrito[idx].q += d;
  if (carrito[idx].q < 1) carrito.splice(idx, 1);
  actualizar();
}
function actualizar() {
  guardar('aurora_carrito', carrito); guardar('aurora_favs', favs);
  $('#cont-car').textContent = carrito.reduce((s, i) => s + i.q, 0);
  $('#cont-fav').textContent = favs.length;
  $('#items').innerHTML = carrito.length ? carrito.map((i, x) => {
    const p = prod(i.id);
    return `<div class="item">
      <div class="mini"><img src="${foto(p)}" alt="${p.n}" data-ph=""></div>
      <div><h4>${p.n}</h4><small>Talla ${i.talla} · ${fmt(p.p)}</small>
        <div class="qty"><button data-q="${x}" data-d="-1" aria-label="Quitar uno">−</button><span>${i.q}</span><button data-q="${x}" data-d="1" aria-label="Agregar uno">+</button><button data-q="${x}" data-d="-999" aria-label="Eliminar">🗑</button></div></div>
      <strong>${fmt(p.p * i.q)}</strong></div>`;
  }).join('') : '<p class="vacio">Tu carrito está vacío.<br>Agrega prendas desde la tienda.</p>';
  const t = totales();
  $('#pie-carrito').innerHTML = carrito.length ? `
    <div class="fila"><span>Subtotal</span><span>${fmt(t.sub)}</span></div>
    <div class="fila"><span>Envío</span><span>${t.env ? fmt(t.env) : 'Gratis'}</span></div>
    ${t.env ? `<p class="nota">Te faltan ${fmt(CONFIG.gratisDesde - t.sub)} para envío gratis.</p>` : ''}
    <div class="fila total"><span>Total</span><span>${fmt(t.total)}</span></div>
    <button class="boton" data-pagar>Finalizar compra</button>
    <button class="boton claro" data-vaciar>Vaciar carrito</button>` : '';
}
const panel = abrir => { $('#panel').classList.toggle('abierto', abrir); $('#velo').classList.toggle('abierto', abrir); };
const cerrarModal = () => $('#modal').classList.remove('abierto');

/* ---------- Pago ---------- */
const METODOS = { tarjeta:'Tarjeta crédito/débito', pse:'PSE', nequi:'Nequi / Daviplata', contra:'Contra entrega' };
const SIGUIENTE = {
  tarjeta:'Registramos tu pago con tarjeta.',
  pse:'Te enviaremos el enlace de pago PSE a tu correo.',
  nequi:'Te enviaremos los datos para completar el pago por Nequi / Daviplata.',
  contra:'Pagarás en efectivo cuando recibas tu pedido.'
};
function abrirPago() {
  if (!carrito.length) return toast('Tu carrito está vacío');
  panel(false);
  const t = totales();
  $('#modal-cont').innerHTML = `
  <h3>Finalizar compra</h3>
  <form id="pago">
    <div class="dos"><input name="nombre" placeholder="Nombre completo" required><input name="tel" type="tel" placeholder="Celular" pattern="[0-9 ]{10,13}" title="Escribe tu celular, solo números" required></div>
    <input name="correo" type="email" placeholder="Correo electrónico" required>
    <div class="dos"><input name="ciudad" placeholder="Ciudad" required><input name="dir" placeholder="Dirección de entrega" required></div>
    <b>Método de pago</b>
    <div class="pagos">
      ${Object.entries(METODOS).map(([k, v], i) => `<label class="pago"><input type="radio" name="metodo" value="${k}" ${i ? '' : 'checked'}> ${{tarjeta:'💳',pse:'🏦',nequi:'📱',contra:'💵'}[k]} ${v}</label>`).join('')}
    </div>
    <div class="extra" data-m="tarjeta">
      <input name="num" inputmode="numeric" placeholder="Número de tarjeta" pattern="[0-9 ]{15,23}" title="Entre 15 y 19 dígitos" required>
      <input name="titular" placeholder="Nombre en la tarjeta" required>
      <div class="dos"><input name="venc" placeholder="MM/AA" pattern="(0[1-9]|1[0-2])/[0-9]{2}" title="Formato MM/AA" required><input name="cvv" inputmode="numeric" placeholder="CVV" pattern="[0-9]{3,4}" title="3 o 4 dígitos" required></div>
    </div>
    <div class="extra" data-m="pse">
      <select name="banco" required><option value="">Elige tu banco</option><option>Bancolombia</option><option>Davivienda</option><option>Banco de Bogotá</option><option>BBVA</option><option>Banco de Occidente</option><option>Nequi</option></select>
    </div>
    <div class="extra" data-m="nequi"><input name="cel" inputmode="numeric" placeholder="Celular Nequi / Daviplata" pattern="[0-9]{10}" title="10 dígitos" required></div>
    <div class="extra" data-m="contra"><p class="nota">Pagas en efectivo al recibir. Ten el valor exacto si es posible.</p></div>
    <div class="fila"><span>Subtotal</span><span>${fmt(t.sub)}</span></div>
    <div class="fila"><span>Envío</span><span>${t.env ? fmt(t.env) : 'Gratis'}</span></div>
    <div class="fila total"><span>Total a pagar</span><span>${fmt(t.total)}</span></div>
    <button class="boton" type="submit">Confirmar pedido</button>
    <p class="nota">Demostración: no se cobra dinero ni se guardan datos de tarjeta. Para cobrar de verdad conecta una pasarela (Wompi, PayU o Mercado Pago).</p>
  </form>`;
  $('#modal').classList.add('abierto');
  const f = $('#pago');
  const ver = () => $$('.extra', f).forEach(x => {
    const on = x.dataset.m === f.metodo.value;
    x.classList.toggle('on', on);
    $$('input,select', x).forEach(c => c.disabled = !on);   // los campos ocultos no se validan
  });
  f.addEventListener('change', ver); ver();
  f.num.addEventListener('input', () => f.num.value = f.num.value.replace(/\D/g, '').slice(0, 19).replace(/(.{4})/g, '$1 ').trim());
  f.addEventListener('submit', e => { e.preventDefault(); confirmar(new FormData(f)); });
}
function confirmar(d) {
  const t = totales(), m = d.get('metodo'), num = 'AUR-' + String(Date.now()).slice(-6);
  const lineas = carrito.map(i => { const p = prod(i.id); return `• ${p.n} (talla ${i.talla}) x${i.q} - ${fmt(p.p * i.q)}`; }).join('\n');
  const texto = `Hola Aurora, hice el pedido ${num}.\n${lineas}\nEnvío: ${t.env ? fmt(t.env) : 'Gratis'}\nTotal: ${fmt(t.total)}\nPago: ${METODOS[m]}\nNombre: ${d.get('nombre')}\nCiudad: ${d.get('ciudad')}\nDirección: ${d.get('dir')}`;
  $('#modal-cont').innerHTML = `
  <div class="exito">
    <div class="ok">🎉</div><h3>¡Gracias, ${d.get('nombre').split(' ')[0]}!</h3>
    <p>Tu pedido <b>${num}</b> fue recibido.</p>
    <div class="resumen"><b>Total:</b> ${fmt(t.total)}<br><b>Pago:</b> ${METODOS[m]}<br><b>Entrega en:</b> ${d.get('dir')}, ${d.get('ciudad')}<br><br>${SIGUIENTE[m]}</div>
    <a class="boton" target="_blank" rel="noopener" href="https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}">Enviar pedido por WhatsApp</a>
    <p class="nota" style="margin-top:12px">Envíalo por WhatsApp para confirmar tu pedido más rápido.</p>
  </div>`;
  carrito = []; actualizar();
}

/* ---------- Página de inicio ---------- */
function iniciarInicio() {
  $('#categorias').innerHTML = Object.entries(CATS).map(([k, v]) =>
    `<a class="cat" href="tienda.html?cat=${k}"><img src="img/categorias/${k}.jpg" alt="${v}" data-ph=""><span>${v}</span></a>`).join('');
  $('#destacados').innerHTML = DESTACADOS.map(id => tarjeta(prod(id))).join('');


  const slides = $$('.diapositiva'), cont = $('#puntos');
  let a = 0, timer;
  slides.forEach((_, i) => { const p = document.createElement('span'); p.className = 'punto' + (i ? '' : ' activo'); p.onclick = () => { ir(i); reiniciar(); }; cont.appendChild(p); });
  const pts = $$('.punto');
  const ir = n => {
    slides[a].classList.remove('activa'); pts[a].classList.remove('activo');
    a = (n + slides.length) % slides.length;
    slides[a].classList.add('activa'); pts[a].classList.add('activo');
  };
  const reiniciar = () => { clearInterval(timer); timer = setInterval(() => ir(a + 1), 5000); };
  $('#siguiente').onclick = () => { ir(a + 1); reiniciar(); };
  $('#anterior').onclick = () => { ir(a - 1); reiniciar(); };
  reiniciar();

  // Suscripción
  $('#formulario').addEventListener('submit', e => {
    e.preventDefault();
    $('#mensaje-form').textContent = `¡Gracias, ${$('#nombre').value.trim()}! Ya estás suscrita 💌`;
    e.target.reset();
  });
}

/* ---------- Página de tienda ---------- */
function iniciarTienda() {
  const params = new URLSearchParams(location.search);
  let cat = params.get('cat') in CATS ? params.get('cat') : (params.get('fav') ? 'fav' : 'todo');
  const chips = { todo:'Todo', ...CATS, fav:'♥ Favoritas' };
  $('#filtros').innerHTML = Object.entries(chips).map(([k, v]) => `<button class="filtro" data-cat="${k}">${v}</button>`).join('');

  const pintar = () => {
    const q = $('#buscar').value.trim().toLowerCase(), max = +$('#precio').value, ord = $('#orden').value;
    $('#precio-txt').textContent = fmt(max);
    $$('.filtro').forEach(b => b.classList.toggle('activo', b.dataset.cat === cat));
    let l = PRODUCTOS.filter(p => (cat === 'todo' || (cat === 'fav' ? favs.includes(p.id) : p.c === cat)) && p.p <= max && (p.n + ' ' + CATS[p.c]).toLowerCase().includes(q));
    if (ord === 'menor') l.sort((a, b) => a.p - b.p);
    if (ord === 'mayor') l.sort((a, b) => b.p - a.p);
    if (ord === 'az') l.sort((a, b) => a.n.localeCompare(b.n, 'es'));
    $('#catalogo').innerHTML = l.map(tarjeta).join('');
    $('#resultados').textContent = `${l.length} ${l.length === 1 ? 'prenda' : 'prendas'}`;
    $('#vacio').hidden = l.length > 0;
  };
  $('#filtros').addEventListener('click', e => { const b = e.target.closest('[data-cat]'); if (b) { cat = b.dataset.cat; pintar(); } });
  ['input', 'change'].forEach(ev => ['#buscar', '#orden', '#precio'].forEach(s => $(s).addEventListener(ev, pintar)));
  pintar();
  window.repintar = () => { if (cat === 'fav') pintar(); };
}

document.addEventListener('click', e => {
  const t = e.target;
  const add = t.closest('[data-add]');
  if (add) return agregar(add.dataset.add, add.closest('.info').querySelector('select').value);
  const fav = t.closest('[data-fav]');
  if (fav) {
    const id = +fav.dataset.fav;
    favs = favs.includes(id) ? favs.filter(x => x !== id) : [...favs, id];
    fav.classList.toggle('activo', favs.includes(id));
    actualizar(); window.repintar && window.repintar(); return;
  }
  const q = t.closest('[data-q]');
  if (q) return cambiarQ(+q.dataset.q, +q.dataset.d);
  if (t.closest('[data-carrito]')) return panel(true);
  if (t.closest('[data-favoritos]')) {
    if (/tienda/.test(location.pathname)) { $('[data-cat="fav"]').click(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    else location.href = 'tienda.html?fav=1';
    return;
  }
  if (t.closest('[data-pagar]')) return abrirPago();
  if (t.closest('[data-vaciar]')) { carrito = []; return actualizar(); }
  if (t.closest('[data-cerrar]') || t.id === 'velo') { panel(false); cerrarModal(); }
  if (t.id === 'modal') cerrarModal();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') { panel(false); cerrarModal(); } });
/* ---------- Respaldo de imágenes ----------
   Si una foto no existe o no carga, se muestra una imagen rosada con
   el nombre de la prenda. Así la página nunca se ve rota. */
function placeholder(txt) {
  const tonos = [['#fde8ef','#f8c9d8'], ['#f6e3ea','#e8b4c6'], ['#fbeee6','#f2cdb8'], ['#efe6f4','#d9c3e8']];
  const t = tonos[[...txt].reduce((a, c) => a + c.charCodeAt(0), 0) % tonos.length];
  const nombre = txt.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${t[0]}"/><stop offset="1" stop-color="${t[1]}"/></linearGradient></defs><rect width="600" height="600" fill="url(#g)"/><g fill="none" stroke="#d6336c" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" opacity=".5" transform="translate(300 ${nombre ? 235 : 290})"><path d="M0-62a17 17 0 1 1 17 17c-9 4-17 9-17 19M-105 38 0-26 105 38Q112 50 96 50H-96Q-112 50-105 38Z"/></g>${nombre ? `<text x="300" y="380" text-anchor="middle" font-family="Georgia,serif" font-size="32" fill="#8a3a57">${nombre}</text>` : ''}</svg>`;
  return 'data:image/svg+xml,' + encodeURIComponent(svg);
}
function respaldo(img) {
  if (img.dataset.fb) return;
  img.dataset.fb = '1';
  const hero = img.closest('.diapositiva');
  if (hero) { img.style.visibility = 'hidden'; hero.classList.add('sin-foto'); return; }   // el banner muestra un degradado
  img.closest('.cat')?.classList.add('sin-foto');
  img.src = placeholder(img.dataset.ph ?? img.alt ?? 'Aurora');
}
document.addEventListener('error', e => { if (e.target.tagName === 'IMG') respaldo(e.target); }, true);

montar();
actualizar();
$('#carrusel') ? iniciarInicio() : iniciarTienda();
$$('img').forEach(i => { if (i.complete && i.naturalWidth === 0 && i.getAttribute('src')) respaldo(i); });