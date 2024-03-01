const API = "https://api.github.com/users/";

function debug(){
    console.log("debug");
}
debug();

const app = Vue.createApp({
    data() {
      return {
        search: null,
        message: "Hello Vue!",
        count: 0,
        result: null,
        error: null,
        favorites: new Map()
      };
    },
    created() {
      const savedFavorites = JSON.parse(window.localStorage.getItem("favorites"))
      if (savedFavorites?.length) {
        const favorites = new Map(savedFavorites.map(favorite => [favorite.id, favorite]))
        this.favorites = favorites
      }
    },
    computed:{
      isFavorite() {
        return this.favorites.has(this.result.id)
      },
      allFavorites() {
        return Array.from(this.favorites.values())
      }
    },

    methods: {
        async  doSearch() {
            this.result = this.error = null
            try{
                const response = await fetch(API + this.search)
                if (!response.ok) throw new Error("User not found");
                const data = await response.json()
                console.log(data);
                this.result = data
                console.log(this.result)
            }catch(error){
                console.log(" -KO-"+error)
                this.error = error;
            }finally{
                this.search = null;
            }
        },
        addFavorite() {
          this.favorites.set(this.result.id, this.result)
          this.updateStorage();
        },
        removeFavorite() {
          this.favorites.delete(this.result.id)
          this.updateStorage();
        },
        updateStorage() {
          window.localStorage.setItem('favorites', JSON.stringify(this.allFavorites))
        },
        showFavorite(favorite){
          this.result = favorite
        },
        increment() {
          this.count++
        }
      },
      mounted() {
        // methods can be called in lifecycle hooks, or other methods!
        this.increment()
      }
  }
  
  
  );


