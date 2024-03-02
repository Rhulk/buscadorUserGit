#Lecciones del curso

1.- Vue 3 desde cero


2.- ¿Qué vas a aprender?

Enlaces importantes:
Documentación de Vue.js
Documentación GitHub API
Live Coding donde desarrollo un proyecto similar con vanilla JavaScript.
Recuerda que puedes descargar el código inicial del repositorio utilizando el botón en la barra lateral.

3.- Primeros pasos con Vue 3

En esta lección del Curso de Vue 3 aprenderás a incorporar Vue.js a tus proyectos JavaScript.
Además, verás lo sencillo que es dar los primeros pasos con Vue y utilizar su famosa reactividad.
Enlaces importantes:
Usar Vue sin herramientas de empaquetado.
Live Server extensión Visual Studio Code.

4.- Vue DevTools y buscar en GitHub

Antes de empezar a desarrollar las funcionalidades de nuestro proyecto es necesario que instales una pieza fundamental para tu workflow de desarrollo con Vue.js: Las Vue DevTools.
Con las DevTools podrás inspeccionar y depurar tus aplicaciones Vue de forma sencilla. Las usaremos extensivamente en los cursos de Escuela Vue.
Además, veremos a grandes rasgos como solicitar información de perfiles de usuario a GitHub a través de su API REST:

const API = "https://api.github.com/users/";
async function doSearch() {
    const response = await fetch(API + 'juanwmedia')
    const data = await response.json()
    console.log(data)
}

Enlaces importantes:
Vue.js DevTools
GitHub API: Get a user
Uso de Async/Await en JavaScript.

5.- Métodos y eventos.

El objetivo de esta lección es aprender a conectar la instancia Vue con la UI del proyecto. Para ello aprenderás lo que son las directivas, los métodos y los eventos en Vue 3.-
Enlaces importantes:
Vue.js declaring methods

6.- Reactividad en 2 sentidos

Una de las características más importantes y potentes de Vue 3 es su famosa reactividad. En esta lección la usarás por primera vez para conectar parte de la vista con el modelo.
Enlaces importantes:
Vue.js reactivity fundamentals

7.- Renderizado condicional

Con las directivas v-if, v-else, v-show y demás Vue nos permite renderizar contenido (elementos HTML) en base a determinadas condiciones. Se trata de utilizar las estructuras de control de siempre, en este nuevo contexto.
Enlaces importantes:
Vue.js conditional rendering

8.- Atributos dinámicos

Tener la información (el estado) de tu App en el modelo es solo la primera parte. Ahora debes renderizarlo en pantalla para que tus usuarios/as puedan verlo, y además mantener modelo y vista siempre sincronizados. Afortunadamente, esto es tarea sencilla gracias la sintaxis de plantilla con {{}} y la directiva v-bind. Veamos como.
Enlaces importantes:
Vue.js template syntax

9.- Agregar a favoritos

En esta lección del Curso de Vue 3 comenzamos a trabajar en la funcionalidad para agregar favoritos, guardándolos en un mapa para que luego sea más sencillo buscarlos y acceder a ellos.
Enlaces importantes:
Maps JavaScript

10.- Propiedades computadas

Las propiedades computadas Vue son una de las características más potentes del framework. Permiten establecer comparaciones y lógica elaborada que se reevalúa cada vez que uno de sus valores a comprobar cambia, asegurando su reactividad.
En esta lección aprenderás a utilizarlas.
Enlaces importantes:
Vue 3 Computed Props

11.- Renderizado de listas

La directiva bucle v-for de Vue 3 nos permitirá mostrar los favoritos que vayamos agregando al proyecto. En esta lección del Curso de Vue 3 aprenderás a usar v-for con de varias maneras diferentes.
Enlaces importantes:
Vue 3 List Rendering
Bucle for...of e iterables
Array map, reduce, filter, forEach, sort

12.- Persistencia

El objetivo de esta lección es utilizar localStorage con Vue para hacer que los datos persistan a refrescos y cierres de navegador.
Enlaces importantes:
Local Storage

13.- Ciclos de vida Vue

El objetivo de esta nueva lección del Curso de Vue 3 es recuperar los favoritos, si los hubiese.
Ahora mismo, si guardamos un favorito y recargamos el navegador, sigue apareciendo en localStorage, pero no lo vemos en la página.
Sería genial poder decirle a Vue que, tan pronto como se cree la instancia, consulte el almacenamiento local y guarde en el modelo (data) los favoritos.
Eso es exactamente lo que podemos conseguir con los ciclos de vida de Vue 3.
Ciclos de vida Vue 3
Cuando Vue se inicializa recorre una serie de pasos, desde la creación hasta su destrucción. Cada uno de estos pasos tiene un hook o al que podemos asociar un callback que se ejecutará en ese momento.
Por ejemplo, podemos actuar cuando se crea la instancia Vue 3 con el hook creaated, cuando se monta con mounted y cuando se desmonta (o destruye) con unmounted.
Echa un vistazo al final a los enlaces importantes para llegar a la documentación.
Hook created Vue 3
Si queremos hacer lo que sea cuando se cargue la instancia Vue, basta con añadir el método created en la raíz de la misma.
Dentro, lo primero que debemos hacer es consultar localStorage para comprobar si hay favoritos. Si en la lección anterior convertíamos una estructura válida en JSON con JSON.stringify, ahora debemos de hacer el proceso contrario: convertir un string en objeto nativo con JSON.parse (tienes enlaces a la documentación al final).
created() {
   const savedFavorites = JSON.parse(window.localStorage.getItem('favorites'))
},
También debemos revisar su longitud (savedFavorites) y luego recrear un nuevo Map con los favoritos guardados.
if (savedFavorites.length) {
    const favorites = new Map(savedFavorites.map(favorite => [favorite.id, favorite]))
    this.favorites = favorites
}
Ahora, al recargar o abrir el navegador, podemos mostrar los favoritos persistidos.
Enlaces importantes:
Ciclo Vida Vue 3
JSON.parse

14.- Mostrar favoritos

El objetivo de esta lección del Curso de Vue 3 es recuperar la información de un favorito y verlo en pantalla.
En realidad es una tarea muy sencilla. Basta con mover el favorito seleccionado a la propiedad result del modelo, que es el lugar donde reside la información del usuario/a de GitHub que estamos viendo en nuestro proyecto.
Queremos que eso ocurra cuando se hace click sobre el favorito. Esto quiere decir que necesitamos usar eventos con Vue, algo que ya hemos hecho.
Primero, podemos crear el método local (en methods, no te olvides) showFavorite. Como ves el método acepta como payload el favorito que quiero ver.
showFavorite(favorite)
{
    this.result = favorite
}
,
Ahora, solo nos queda conectar los elementos del DOM que renderizan cada favorito con el nuevo método. Para ello tenemos la directiva v-on, junto con el método click y el modificador prevent (de preventDefault) para que un elemento a nativo sin href establecido no “salte” y mueva el scroll hacia arriba.
<a href="#" @click.prevent="showFavorite(favorite)">
    <img :src="favorite.avatar_url" :alt="favorite.name" class="favorite__avatar">
</a>
Con todo ello, ya podemos visualizar los favoritos que tenemos guardados en almacenamiento local.
Enlaces importantes:
Vue event handing

**15.- Transiciones con Vue 3**

El objetivo de esta lección es añadir fluidez a nuestra interfaz.
Para ello vamos a hacer uso de las transiciones Vue, estas nos permiten animar la aparición y desaparición de elementos con la directiva **v-if**.
El primer lugar donde implementar el componente transition-group estos ajustes es en la zona donde mostramos los favoritos.
```html
<!-- Favorites -->
<transition-group name="list">
    <div class="favorite" v-for="favorite in allFavorites" :key="favorite.id">
       ...
    </div>
</transition-group>
```
Necesitaremos también añadir selectores CSS apropiados para esta transición llamada list.
```css
.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
}
```
Para finalizar nos queda animar la aparición y desaparición de la zona donde se muestran los resultados de la búsqueda. En este caso usaremos transition en lugar de transition-group⁣, ya que no se trata de una lista.
```html
<!-- Result -->
<Transition>
    <div class="result" v-if="result">
      ...
    </div>
</Transition>
```
Por supuesto, también necesitamos el código CSS adecuado. Como no hemos definido un nombre para la transición, podemos utilizar el nombre por defecto.
```css
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
```
Y con tan poco esfuerzo hemos conseguido añadir transiciones a nuestra pequeña aplicación 😃.
Enlaces
https://vuejs.org/guide/built-ins/transition.html
https://vuejs.org/guide/built-ins/transition-group.html
https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators/Optional_chaining


