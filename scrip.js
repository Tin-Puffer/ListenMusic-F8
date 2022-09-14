const x=document.querySelector.bind(document)
const xx=document.querySelectorAll.bind(document)


//QUERYSELECTION
const playlist= x('.playlist')
const heading=x('header h2')
const cdthumb= x('.cd-thumb')
const audio=x('#audio')
const bntplay= x('.btn-toggle-play')
const player=x('.player')
const progress=x('#progress')
const bntnext=x('.btn-next')
const bntprev=x('.btn-prev')
const random=x('.btn-random')
const bntloop=x('.btn-repeat')
const songactive=x('.song.active')
const PLAYER_STORAGE='F8_PLAYER'
var curentindex = 0


const app={
     thisx: this,
     israndom: false,
     isloop:false,
     isplay: false,
    
     // lưu config lên web. load lại không mất cài đặt 
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE)) || {},
    setconfig:function(key,value)
    {
        this.config[key]= value
        localStorage.setItem(PLAYER_STORAGE,JSON.stringify( this.config))
    },
    loadconfig:function()
    {
        this.israndom =this.config.israndom
        this.isloop = this.config.isloop
    },

    //list API
    songs:[
        
        {
            name: 'Hotaru',
            singer: 'Hotarubi No Mori e',
            path: 'hotaru.mp3',
            img:'Hotaru.jpg'
        },
        {
            name: 'Yume To Hazakura',
            singer: 'ヲタみん | Wotamin',
            path: 'yume.mp3',
            img:'yume.jpg'
        },
        {
            name: 'Kokoronashi',
            singer: 'Koe no Katachi',
            path: 'danghinhamthanh.mp3',
            img:'-Voice-Wallpapers-1024x540.jpg'
        },
        {
            name: 'Hazy moon',
            singer: 'Hatsune Miku',
            path: 'hazymoon.mp3',
            img:'hazymon.jpg'
        },
        {
            name: 'Kimi no Na wa',
            singer: 'Kamishiraishi Mone',
            path: 'yourname.mp3',
            img:'maxresdefault.jpg'
        },
        {
            name: 'SAKURA ',
            singer: 'Ikimonogakari',
            path: 'sakura.mp3',
            img:'sakura.jpg'
        },
        {
            name: 'Lemon ',
            singer: 'Cover bởi Kobasolo & Harutya',
            path: 'lemon.mp3',
            img:'lemon.jpg'
        },
        {
            name: 'BEST FIEND',
            singer: 'unKNOW',
            path: 'bestf.mp3',
            img:'bestf.jpg'
        },
    ],
    

    


    // hàm hàm render bài hát lên main song
    getcurentsong:function()
    {
        return this.songs[curentindex]
    },
    updatesong:function()
    {

        console.log(this.getcurentsong().name,)
        heading.textContent=this.getcurentsong().name
        cdthumb.style.backgroundImage  = `url('${this.getcurentsong().img}')`
        audio.src=this.getcurentsong().path
    },



    // hàm render tất cả bài hát lên list song
    render:function()
    {

        const html=this.songs.map(function(value,index)
        {
            
            return `
            <div class="song ${index===curentindex ? 'active' :''} " data-index=${index} >
            <div class="thumb" style="background-image: url('${value.img}')">
            </div>
            <div class="body">
              <h3 class="title">${value.name}</h3>
              <p class="author">${value.singer} </p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>`

          //nếu index bằng curentsong thì thêm class active
        })  
        playlist.innerHTML=html.join('')
    },
    

 
    // hàm next 
    nextsongx: function()
    {
        progress.value=0;
        curentindex+=1
        if(curentindex<this.songs.length){
           
            this.updatesong()
        }
        else{
           curentindex=0
           this.updatesong()
        }
    },
    // hàm priven
    prevsong : function()
    {
        progress.value=0;
        curentindex--
        if(curentindex==-1)
        {
            curentindex=app.songs.length-1
            this.updatesong()
        }
        else{
            this.updatesong()
        }
    },

    // hàm random cài đặt random cho curenindex rồi updatesong
    playrandom: function()
    {
        let newindex
        do{
            newindex=Math.floor(Math.random()*this.songs.length)
        }while(newindex=== curentindex)
        curentindex= newindex
        this.updatesong()
    },
 
    // hàm cuộn màn hình cho active ra giữa
    scrollactivesong: function()
    {
       
            x('.song.active').scrollIntoView(
                {
                    behavior: 'smooth',
                    block: 'center'
                }
            );
      
    },


    // bắt sự kiện 
    hedeleven:function()
    {



        ///   [DOC ANIMATE]
        var cdthumbanimate = cdthumb.animate([
            { transform: 'rotate(360deg)'}
        ],
        {
            duration: 10000,
            iterations: Infinity
        }
        )
        cdthumbanimate.pause()
        ///


        // CROOLE FUNCTION
        const cd=x('.cd')
        var cdwidth= cd.clientWidth
        document.onscroll=function()
        {
            // console.log((window.scrollY).toFixed(0))
            cd.setAttribute('style','display: block')
            var newcdwwidth=cdwidth-(window.scrollY).toFixed(0)
            if(newcdwwidth>=0)
            {
                cd.style.width=newcdwwidth +'px'
            }
            else cd.setAttribute('style','display: none')
            cd.style.opacity=newcdwwidth/cdwidth
            // cd.style.width=newcdwwidth > 0 ? newcdwwidth :0
        }


        // SỬ LÝ Play BTN
        bntplay.onclick= function()
        {
            if(!app.isplay)
            {
                audio.play()
                
            }else{
                audio.pause()
                
            }
        }
        
        // SỬ LÝ WHEN AUDIO PLAY
        audio.onplay=function()
        {
            player.classList.add('playing')
            app.isplay=true
            
            cdthumbanimate.play()
        }
        audio.onpause=function()
        {
            player.classList.remove('playing')
            app.isplay=false
            cdthumbanimate.pause()
        }

        // SỬ LÝ UPDATE TIME LINE
        audio.ontimeupdate= function(){
           var linepercent= Math.floor(audio.currentTime/ audio.duration  *100)
           if(audio.duration)
           {
               progress.setAttribute('value',Math.floor(audio.currentTime/ audio.duration  *100))
           }
                
        }
        // sử lý REWINGD AUDIO LINE
        progress.onchange=function(e)
        {
            audio.currentTime=(audio.duration/100)*e.target.value
        }

        //  SỬ LÝ NEXT BNT
        bntnext.onclick= function()
        {

            if(app.israndom)
            {
                app.playrandom();
                audio.play()

            }else{
                app.nextsongx()
                audio.play()
            }
            app.render()
            app.scrollactivesong()
            
        }

        // SỬ LÝ PREVIUS BTN
        bntprev.onclick=function()
        {
            if(app.israndom)
            {
                app.playrandom();
                audio.play()

            }else{
                
                app.prevsong()
                audio.play()
            }
            app.render()
            app.scrollactivesong()
        }

        // SỬ LÝ RANDOM BNT
        random.onclick=function()
        {
            app.israndom=!app.israndom
            app.setconfig('israndom',app.israndom)
            random.classList.toggle('active',app.israndom)
            
        }

        // SỬ LÝ AUDIO ENDED
        audio.onended= function()
        {
            if(app.isloop)
            {
                audio.play()
                console.log(app.isloop)
            }
            else{

                bntprev.onclick()
            }
        }

        // SỬ LÝ LOOP BNT
        bntloop.onclick=function()
        {
            app.isloop=!app.isloop
            app.setconfig('isloop',app.isloop)
            bntloop.classList.toggle('active',app.isloop)
            console.log(app.isloop)
        }

        // SỬ LÝ CLICK LIST SONG
        playlist.onclick=function(e)
        {
            const songnode=e.target.closest('.song:not(.active)')
            console.log(songnode)
            if(songnode || e.target.closest('.option'))
            {

                if(songnode)
                {
                    curentindex= Number( songnode.getAttribute('data-index'))
                    app.updatesong()
     
                    audio.play()
                    app.render()
                }
            }
        }
        
    },
     

    // FUCNTION START
    start: function()
    {
        this.loadconfig()
        random.classList.toggle('active',app.israndom)
        bntloop.classList.toggle('active',app.isloop)
        //render bài hát trong list
        
        this.render()

        //upload bài hát

        this.updatesong()

        // bắt sự kiện xảy ra trên docm
        this.hedeleven()
    }
    
}

app.start()