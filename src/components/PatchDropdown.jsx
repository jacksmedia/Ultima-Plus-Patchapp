export default function PatchDropdown(props) {

    return(
        <div class="grid gap-0 column-gap-0">
                {/* <!-- dropdown of patches --> */}
                <select id="patch-dropdown">
                    <option value="" disabled selected>Select a patch</option>
                </select>    
    
                <button id="applyPatch" class="">Apply Patch</button>
                <p>&nbsp;</p>
                <p>Current version of Ultima Plus is 1.07a</p>
                <p>
                    <a target="_blank" href="https://github.com/jacksmedia/Ultima-Plus-Patchapp/blob/main/Final%20Fantasy%20IV%20Ultima%20Plus%20changelog.txt">
                        View Plus vs Classic changelog
                    </a>
                </p>
            </div>
    );
}