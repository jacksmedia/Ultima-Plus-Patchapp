export default function Promos(props) {

return(
<div class="row">
    <div class="col-sm-6 d-flex justify-content-space-around align-items-center">

        <h5 style="color:#eff;">
            If you want custom <span style="color:aqua;">graphics...</span>
        </h5>
        {/* black btn styled div */}
        <a href="styles.html" style="text-decoration:none;">
            <button class="d-flex justify-content-center align-items-center"
            style="background: black; padding: 1rem; border-radius: 2rem;">
                <h4 style="color:aqua;">
                    FF4 Ultima Plus Styles
                </h4>
            </button>
        </a>
    </div>

    <div class="col-sm-6 d-flex justify-content-space-around align-items-center">
        <h5 style="color:#eff;">
            If you want custom <span style="color:tomato;">fonts...</span>
        </h5>
        {/* black btn styled div */}
        <a href="fonts.html" style="text-decoration:none;">
            <button class="d-flex justify-content-center align-items-center"
            style="background: black; padding: 1rem; border-radius: 2rem;">
                <h4 style="color:tomato;">
                    FF4 Ultima Plus Fonts
                </h4>
            </button>
        </a>
    </div>


    {/* 4th row for Guides, Classic, and Discord link */}

    <div class="col-sm-4 d-flex align-items-center justify-content-center">
        {/* black btn styled div */}
        <a href="guides.html" style="text-decoration:none;">
        <button class="d-flex justify-content-center align-items-center"
        style="background: black; padding: 1.2rem; border-radius: 2rem;">
            <h4 class="lilytext">
                FF4 Ultima Guides
            </h4>
        </button>
        </a>		
    </div>



    <div class="col-sm-4 d-flex align-items-center justify-content-center">
        <p>If you want to play Ultima with RetroAchievements, find the <span style="color:palegoldenrod;">Classic Edition</span> patches here:</p>
        {/* black btn styled div */}
        <a href="classic.html" style="text-decoration:none;">
        <button class="d-flex justify-content-center align-items-center"
        style="background: black; padding: 1.2rem; border-radius: 2rem;">
            <span style="color:palegoldenrod; text-decoration:none;">
                FF4 Ultima Classic
            </span>
        </button>
        </a>
    </div>


    <div class="col-sm-4 d-flex justify-content-center align-items-center">			
        {/* black btn styled link  */}
        <a href="https://discord.gg/PGMASbSnD9" 
        target="_blank"
        style="text-decoration:none;">
        <button class="d-flex justify-content-center align-items-center"
        style="background: black; padding: 1rem; border-radius: 2rem;">
            <h6 style="color: white;">Join us in
            <span style="color:#f7dc6f;">
                Ultima Discord
            </span>
            </h6>
        </button>
        </a>
    </div>

    <hr/>
</div>
);}
