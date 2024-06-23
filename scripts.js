// Matrices (In the future, storing these in a texture might be better)
const bayerMatrix2x2 = [[.0, .5], [.75, .25]];
const bayerMatrix4x4 = [[.0, .5, .125, .625], [.75, .25, .875, .375], [.1875, .6875, .0625, .5625], [.9375, .4375, .8125, .3125]];
const bayerMatrix8x8 = [[.0, .5, .125, .625, .03125, .53125, .15625, .65625], [.75, .25, .875, .375, .78125, .28125, .90625, .40625], [.1875, .6875, .0625, .5625, .21875, .71875, .09375, .59375], [.9375, .4375, .8125, .3125, .96875, .46875, .84375, .34375], [.046875, .546875, .171875, .671875, .015625, .515625, .140625, .640625], [.796875, .296875, .921875, .421875, .765625, .265625, .890625, .390625], [.234375, .734375, .109375, .609375, .203125, .703125, .078125, .578125], [.984375, .484375, .859375, .359375, .953125, .453125, .828125, .328125]];
const bayerMatrix16x16 = [[.0, .5, .125, .625, .03125, .53125, .15625, .65625, .0078125, .5078125, .1328125, .6328125, .0390625, .5390625, .1640625, .6640625], [.75, .25, .875, .375, .78125, .28125, .90625, .40625, .7578125, .2578125, .8828125, .3828125, .7890625, .2890625, .9140625, .4140625], [.1875, .6875, .0625, .5625, .21875, .71875, .09375, .59375, .1953125, .6953125, .0703125, .5703125, .2265625, .7265625, .1015625, .6015625], [.9375, .4375, .8125, .3125, .96875, .46875, .84375, .34375, .9453125, .4453125, .8203125, .3203125, .9765625, .4765625, .8515625, .3515625], [.046875, .546875, .171875, .671875, .015625, .515625, .140625, .640625, .0546875, .5546875, .1796875, .6796875, .0234375, .5234375, .1484375, .6484375], [.796875, .296875, .921875, .421875, .765625, .265625, .890625, .390625, .8046875, .3046875, .9296875, .4296875, .7734375, .2734375, .8984375, .3984375], [.234375, .734375, .109375, .609375, .203125, .703125, .078125, .578125, .2421875, .7421875, .1171875, .6171875, .2109375, .7109375, .0859375, .5859375], [.984375, .484375, .859375, .359375, .953125, .453125, .828125, .328125, .9921875, .4921875, .8671875, .3671875, .9609375, .4609375, .8359375, .3359375], [.01171875, .51171875, .13671875, .63671875, .04296875, .54296875, .16796875, .66796875, .00390625, .50390625, .12890625, .62890625, .03515625, .53515625, .16015625, .66015625], [.76171875, .26171875, .88671875, .38671875, .79296875, .29296875, .91796875, .41796875, .75390625, .25390625, .87890625, .37890625, .78515625, .28515625, .91015625, .41015625], [.19921875, .69921875, .07421875, .57421875, .23046875, .73046875, .10546875, .60546875, .19140625, .69140625, .06640625, .56640625, .22265625, .72265625, .09765625, .59765625], [.94921875, .44921875, .82421875, .32421875, .98046875, .48046875, .85546875, .35546875, .94140625, .44140625, .81640625, .31640625, .97265625, .47265625, .84765625, .34765625], [.05859375, .55859375, .18359375, .68359375, .02734375, .52734375, .15234375, .65234375, .05078125, .55078125, .17578125, .67578125, .01953125, .51953125, .14453125, .64453125], [.80859375, .30859375, .93359375, .43359375, .77734375, .27734375, .90234375, .40234375, .80078125, .30078125, .92578125, .42578125, .76953125, .26953125, .89453125, .39453125], [.24609375, .74609375, .12109375, .62109375, .21484375, .71484375, .08984375, .58984375, .23828125, .73828125, .11328125, .61328125, .20703125, .70703125, .08203125, .58203125], [.99609375, .49609375, .87109375, .37109375, .96484375, .46484375, .83984375, .33984375, .98828125, .48828125, .86328125, .36328125, .95703125, .45703125, .83203125, .33203125]];
const blueNoise16x16 = [[.4296875, .1875, .55078125, .62890625, .4375, .7578125, .2734375, .6875, .78125, .19140625, .5859375, .36328125, .25390625, .140625, .328125, .98046875], [.09375, .3828125, .9296875, .86328125, .12109375, .97265625, .57421875, .0703125, .14453125, .41015625, .85546875, .66015625, .75390625, .53515625, .046875, .6484375], [.484375, .69140625, .3046875, .0546875, .25, .671875, .4765625, .3359375, .828125, .5078125, .9609375, .0859375, .44921875, .20703125, .890625, .82421875], [.15625, .78515625, .58984375, .51171875, .734375, .40234375, .203125, .91796875, .625, .23828125, .0, .703125, .296875, .9375, .5703125, .26171875], [.00390625, .94921875, .21484375, .3515625, .89453125, .015625, .79296875, .10546875, .7265625, .390625, .55859375, .80078125, .125, .35546875, .73828125, .4140625], [.8671875, .63671875, .44140625, .13671875, .83203125, .60546875, .5390625, .26953125, .953125, .32421875, .87890625, .18359375, .48828125, .61328125, .0625, .5234375], [.3203125, .76171875, .078125, .98828125, .29296875, .171875, .6953125, .4453125, .04296875, .15234375, .65625, .40625, .984375, .68359375, .8203125, .2265625], [.38671875, .69921875, .5625, .47265625, .66796875, .375, .9140625, .5, .8359375, .578125, .7734375, .02734375, .27734375, .09765625, .92578125, .16796875], [.90234375, .1171875, .265625, .0390625, .796875, .22265625, .06640625, .75, .33984375, .23046875, .43359375, .859375, .54296875, .33203125, .46484375, .59375], [.80859375, .50390625, .9453125, .62109375, .87109375, .42578125, .12890625, .96484375, .640625, .08984375, .91015625, .71484375, .19921875, .76953125, .6640625, .01953125], [.41796875, .73046875, .1953125, .34375, .53125, .72265625, .59765625, .30078125, .1796875, .51953125, .37890625, .609375, .1328125, .96875, .3671875, .2421875], [.05859375, .2890625, .8515625, .1484375, .0, .2578125, .88671875, .46875, .765625, .93359375, .0078125, .28515625, .4921875, .07421875, .8828125, .5546875], [.95703125, .6796875, .4609375, .77734375, .9765625, .3984375, .56640625, .05078125, .8125, .67578125, .421875, .84765625, .74609375, .31640625, .7890625, .6328125], [.109375, .359375, .58203125, .08203125, .64453125, .70703125, .2109375, .11328125, .34765625, .24609375, .16015625, .546875, .65234375, .21875, .453125, .17578125], [.83984375, .90625, .234375, .49609375, .3125, .921875, .84375, .45703125, .6171875, .9921875, .71875, .1015625, .94140625, .39453125, .01171875, .515625], [.28125, .7421875, .03125, .81640625, .1640625, .37109375, .0234375, .52734375, .8984375, .30859375, .03515625, .48046875, .875, .8046875, .6015625, .7109375]];
const blueNoise32x32 = [[.59375, .6484375, .84765625, .953125, .57421875, .7578125, .81640625, .88671875, .54296875, .94140625, .13671875, .2265625, .984375, .56640625, .4296875, .03125, .96484375, .47265625, .22265625, .3671875, .3046875, .73828125, .8984375, .23828125, .4453125, .0703125, .2578125, .41015625, .55859375, .74609375, .37109375, .28515625], [.9765625, .3359375, .22265625, .69140625, .46875, .296875, .08984375, .42578125, .25390625, .62890625, .83203125, .4609375, .3515625, .171875, .84765625, .25, .53125, .64453125, .08203125, .87890625, .1796875, .83203125, .4921875, .15234375, .94140625, .59375, .69921875, .3203125, .015625, .82421875, .06640625, .48046875], [.140625, .43359375, .05859375, .171875, .91015625, .0234375, .66796875, .51171875, .7421875, .3203125, .03515625, .68359375, .515625, .89453125, .734375, .12890625, .69140625, .9140625, .7578125, .57421875, .45703125, .10546875, .63671875, .54296875, .35546875, .77734375, .125, .8515625, .92578125, .52734375, .2421875, .71875], [.5703125, .87109375, .80859375, .53515625, .37890625, .6015625, .84375, .15625, .97265625, .11328125, .59375, .92578125, .0625, .28515625, .625, .38671875, .31640625, .00390625, .40625, .2734375, .9921875, .68359375, .32421875, .03125, .8671875, .19921875, .48828125, .625, .4375, .171875, .66015625, .8984375], [.09765625, .73828125, .3125, .25, .7734375, .94921875, .33984375, .21875, .45703125, .37890625, .78125, .19921875, .41796875, .796875, .09765625, .4921875, .8203125, .20703125, .51953125, .79296875, .0546875, .22265625, .921875, .74609375, .421875, .26171875, .98046875, .0859375, .2890625, .79296875, .34375, .40234375], [.50390625, .00390625, .66015625, .4453125, .109375, .703125, .046875, .5625, .65234375, .87109375, .2734375, .70703125, .546875, .96484375, .23046875, .87890625, .5859375, .95703125, .71875, .14453125, .609375, .3828125, .80859375, .56640625, .07421875, .65625, .37890625, .76171875, .58203125, .0390625, .94921875, .203125], [.27734375, .97265625, .58203125, .890625, .19140625, .484375, .2890625, .9140625, .8125, .0078125, .49609375, .140625, .36328125, .0234375, .6640625, .453125, .1640625, .07421875, .3359375, .43359375, .86328125, .2890625, .47265625, .17578125, .703125, .51171875, .90625, .15625, .53515625, .69140625, .85546875, .6171875], [.78125, .359375, .1484375, .83203125, .39453125, .6328125, .76953125, .08984375, .41015625, .18359375, .62109375, .90234375, .75, .5703125, .29296875, .765625, .37109375, .62890625, .90625, .6796875, .53125, .015625, .9453125, .1171875, .875, .30078125, .0, .82421875, .24609375, .4140625, .125, .46484375], [.9140625, .23046875, .71484375, .03515625, .5546875, .96484375, .23828125, .51953125, .734375, .31640625, .984375, .2421875, .44140625, .109375, .86328125, .94140625, .04296875, .25390625, .828125, .09765625, .2109375, .76953125, .64453125, .578125, .3515625, .21484375, .73046875, .4765625, .93359375, .328125, .75, .06640625], [.65234375, .43359375, .51171875, .3203125, .08203125, .80078125, .3515625, .12890625, .6796875, .58984375, .0703125, .8359375, .6875, .33984375, .19921875, .5078125, .72265625, .5546875, .46875, .3125, .96875, .40625, .2578125, .83984375, .44140625, .95703125, .59765625, .37109375, .046875, .63671875, .19140625, .55078125], [.8125, .11328125, .85546875, .90625, .671875, .17578125, .4375, .9296875, .8671875, .46484375, .375, .53125, .0390625, .80078125, .61328125, .1328125, .3984375, .79296875, .17578125, .6015625, .7265625, .14453125, .5, .0390625, .7578125, .078125, .671875, .14453125, .5078125, .875, .9921875, .296875], [.16796875, .390625, .6015625, .265625, .4765625, .74609375, .61328125, .015625, .2734375, .2109375, .76171875, .1640625, .95703125, .26953125, .46484375, .67578125, .98828125, .01953125, .890625, .35546875, .05859375, .91796875, .6875, .3203125, .54296875, .18359375, .86328125, .796875, .25390625, .71484375, .359375, .01171875], [.76171875, .9609375, .70703125, .203125, .0625, .9765625, .30859375, .56640625, .8203125, .0859375, .91796875, .6484375, .41015625, .578125, .8984375, .08203125, .3046875, .23828125, .6484375, .8515625, .55859375, .421875, .8046875, .2265625, .98046875, .39453125, .29296875, .5625, .08203125, .42578125, .609375, .484375], [.24609375, .55859375, .03125, .34375, .53515625, .84375, .1484375, .40234375, .6953125, .484375, .3046875, .72265625, .0078125, .22265625, .83984375, .3671875, .765625, .4375, .50390625, .10546875, .2734375, .16796875, .6171875, .87890625, .10546875, .65234375, .44921875, .7421875, .9453125, .20703125, .8359375, .66796875], [.1015625, .453125, .8828125, .76953125, .41796875, .65625, .234375, .78515625, .90234375, .1328125, .55078125, .359375, .78125, .51171875, .15234375, .6953125, .546875, .1875, .71484375, .9609375, .77734375, .48046875, .03125, .34765625, .7265625, .5, .0078125, .88671875, .1328125, .33203125, .046875, .91015625], [.37890625, .30078125, .6328125, .12890625, .93359375, .0859375, .5078125, .33984375, .02734375, .6328125, .984375, .25, .1015625, .93359375, .625, .046875, .90234375, .8203125, .0, .3125, .38671875, .68359375, .94140625, .5859375, .265625, .1640625, .7890625, .3671875, .6875, .5859375, .5234375, .7890625], [.7265625, .21875, .81640625, .48046875, .26953125, .71875, .859375, .59765625, .453125, .1875, .83203125, .41796875, .87109375, .4609375, .3359375, .27734375, .40625, .59375, .13671875, .62890625, .84375, .1953125, .07421875, .4296875, .828125, .921875, .62109375, .234375, .46484375, .28125, .953125, .15625], [.50390625, .07421875, .98828125, .5859375, .1796875, .3828125, .05078125, .9609375, .28125, .73046875, .078125, .68359375, .57421875, .1953125, .73828125, .97265625, .48828125, .234375, .9296875, .44921875, .5234375, .25, .7578125, .5546875, .32421875, .04296875, .52734375, .9765625, .0625, .84375, .4140625, .609375], [.86328125, .6953125, .3359375, .01953125, .9140625, .66796875, .5390625, .21875, .80078125, .39453125, .53125, .30859375, .04296875, .8046875, .12109375, .671875, .05859375, .7734375, .3515625, .72265625, .1015625, .9921875, .859375, .13671875, .6640625, .20703125, .40625, .70703125, .12109375, .75, .1953125, .00390625], [.2578125, .3984375, .55078125, .73828125, .4296875, .3046875, .765625, .1171875, .640625, .90625, .15625, .953125, .62109375, .37109375, .51953125, .85546875, .1640625, .55859375, .88671875, .03515625, .29296875, .60546875, .36328125, .48828125, .734375, .87890625, .296875, .8046875, .4921875, .64453125, .328125, .9296875], [.66015625, .1171875, .79296875, .2265625, .8515625, .15234375, .890625, .4609375, .34765625, .0, .49609375, .76953125, .21484375, .89453125, .2578125, .42578125, .30859375, .640625, .21484375, .8125, .6796875, .1796875, .4140625, .01171875, .95703125, .09375, .59765625, .16796875, .3671875, .89453125, .5703125, .453125], [.16796875, .9609375, .4765625, .078125, .62109375, .515625, .0546875, .703125, .5625, .83984375, .265625, .44140625, .7109375, .0234375, .58984375, .74609375, .9453125, .10546875, .390625, .45703125, .53515625, .91796875, .7890625, .63671875, .234375, .4453125, .5390625, .9375, .02734375, .23828125, .08984375, .82421875], [.296875, .359375, .57421875, .91796875, .28125, .40234375, .984375, .24609375, .18359375, .9375, .65625, .109375, .33203125, .98828125, .4765625, .06640625, .828125, .5078125, .7109375, .96875, .14453125, .0625, .26953125, .83984375, .33984375, .69921875, .8515625, .28125, .671875, .77734375, .52734375, .7109375], [.8828125, .75, .02734375, .1875, .67578125, .8203125, .32421875, .58984375, .7421875, .0703125, .3828125, .80859375, .5390625, .1484375, .6875, .19140625, .34765625, .26171875, .00390625, .59765625, .33203125, .7421875, .4921875, .578125, .125, .0546875, .75390625, .3984375, .140625, .96875, .41796875, .05078125], [.5, .6328125, .84765625, .4375, .73046875, .125, .015625, .796875, .421875, .50390625, .90234375, .6015625, .2421875, .875, .40234375, .6171875, .921875, .78125, .890625, .23046875, .6640625, .859375, .1875, .38671875, .98046875, .515625, .203125, .625, .484375, .33203125, .609375, .21484375], [.38671875, .13671875, .25, .52734375, .34375, .9453125, .47265625, .65234375, .1484375, .30078125, .203125, .71875, .08984375, .7890625, .28515625, .5234375, .12109375, .44921875, .5625, .375, .11328125, .43359375, .91015625, .6484375, .7734375, .30859375, .8984375, .0, .8671875, .8125, .1015625, .9296875], [.28515625, .7734375, .97265625, .09375, .60546875, .8828125, .21875, .546875, .84765625, .96875, .02734375, .36328125, .46875, .94921875, .01953125, .75390625, .67578125, .171875, .0546875, .72265625, .80859375, .2890625, .01953125, .078125, .24609375, .45703125, .58203125, .71484375, .26171875, .1796875, .5546875, .69140625], [.89453125, .4609375, .6640625, .0390625, .41015625, .70703125, .26953125, .05859375, .375, .75390625, .6796875, .56640625, .828125, .640625, .421875, .2265625, .98046875, .31640625, .875, .49609375, .953125, .61328125, .546875, .69921875, .82421875, .16015625, .94921875, .09375, .375, .4453125, .75, .0234375], [.16015625, .578125, .2109375, .8046875, .3125, .16015625, .77734375, .921875, .6171875, .44140625, .12109375, .26171875, .16015625, .32421875, .06640625, .58984375, .8359375, .390625, .640625, .25390625, .1953125, .35546875, .46875, .92578125, .328125, .4140625, .66015625, .5390625, .80078125, .98828125, .64453125, .328125], [.8359375, .36328125, .9375, .55078125, .87109375, .44921875, .5, .09765625, .31640625, .2109375, .91015625, .859375, .51953125, .93359375, .73046875, .48046875, .109375, .54296875, .01171875, .75390625, .140625, .78515625, .09375, .85546875, .20703125, .1171875, .76171875, .03515625, .29296875, .23046875, .0703125, .515625], [.703125, .11328125, .265625, .734375, .05078125, .63671875, .9921875, .6953125, .58203125, .796875, .48828125, .04296875, .65625, .3828125, .19921875, .8828125, .27734375, .69921875, .92578125, .4296875, .5234375, .9765625, .27734375, .5703125, .62890625, .5, .34765625, .88671875, .47265625, .60546875, .8671875, .42578125], [.78515625, .01171875, .49609375, .39453125, .1328125, .2421875, .35546875, .18359375, .0, .3984375, .7109375, .30078125, .765625, .0859375, .61328125, .78515625, .34375, .15234375, .81640625, .60546875, .05078125, .66796875, .390625, .0078125, .7265625, .81640625, .96484375, .17578125, .67578125, .12890625, .9375, .19140625],];

// HTML elements
const primaryColorPicker = document.getElementById('primaryColorPicker');
const secondaryColorPicker = document.getElementById('secondaryColorPicker');
const flipButton = document.getElementById('flipButton');
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d', {alpha: false, willReadFrequently: true});
const saveButton = document.getElementById('saveButton');
const patternSlider = document.getElementById('patternSlider');
const invertButton = document.getElementById('invertButton');
const ditherSelection = document.getElementById('ditherSelection');
const aspectRatioSelection = document.getElementById('aspectRatioSelection');
const videoContainer = document.getElementById('videoContainer');
const resolutionSlider = document.getElementById('resolutionSlider');

// Settings
let primaryColorRgb = hexToRgb(primaryColorPicker.value);
let secondaryColorRgb = hexToRgb(secondaryColorPicker.value);
let patternInterval = parseInt(patternSlider.value);
let resolution = parseInt(resolutionSlider.value);
let aspectRatio = aspectRatioSelection.value;
let invertColours = false;
let flipImage = true;
let width = canvas.width = 16 * resolution;
let height = canvas.height = 16 * resolution;

// Event listeners
primaryColorPicker.addEventListener('input', () => {
    document.documentElement.style.setProperty('--primary-color', primaryColorPicker.value);
    const svgPattern = `
        <svg xmlns='http://www.w3.org/2000/svg' width='8' height='8'>
            <rect x='0' y='0' width='2' height='2' fill='${primaryColorPicker.value}' />
            <rect x='4' y='4' width='2' height='2' fill='${primaryColorPicker.value}' />
        </svg>`;
    const encodedPattern = `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgPattern)}")`;
    document.documentElement.style.setProperty('--dot-pattern', encodedPattern);
    primaryColorRgb = hexToRgb(primaryColorPicker.value);
});

secondaryColorPicker.addEventListener('input', () => {
    document.documentElement.style.setProperty('--secondary-color', secondaryColorPicker.value);
    secondaryColorRgb = hexToRgb(secondaryColorPicker.value);
});

patternSlider.addEventListener('input', () => patternInterval = parseInt(patternSlider.value));

resolutionSlider.addEventListener('input', updateResolutionAndAspectRatio);
aspectRatioSelection.addEventListener('change', updateResolutionAndAspectRatio);
invertButton.addEventListener('click', () => invertColours = !invertColours);
flipButton.addEventListener('click', () => flipImage = !flipImage);
video.addEventListener('play', processFrame);
saveButton.addEventListener('click', saveCanvasAsSVG);
document.addEventListener('DOMContentLoaded', fetchLatestCommit);

// Get webcam feed
navigator.mediaDevices.getUserMedia({video: true})
    .then(stream => {
        video.srcObject = stream;
        video.play();
    })
    .catch(err => console.error("Error accessing the webcam:", err));

// Update canvas size, so it always matches the aspect ratio and resolution
function updateResolutionAndAspectRatio() {
    resolution = parseInt(resolutionSlider.value);
    aspectRatio = aspectRatioSelection.value;
    switch (aspectRatio) {
        case '1:1':
            videoContainer.style.aspectRatio = '1 / 1';
            width = height = 16 * resolution;
            break;
        case '4:3':
            videoContainer.style.aspectRatio = '4 / 3';
            width = 16 * resolution;
            height = 12 * resolution;
            break;
        case '16:9':
            videoContainer.style.aspectRatio = '16 / 9';
            width = 16 * resolution;
            height = 9 * resolution;
            break;
    }
    canvas.width = width;
    canvas.height = height;

    // Above some resolution, we want to smooth the image to avoid aliasing, especially when using bayer matrices
    canvas.style.imageRendering = canvas.width * 1.5 > canvas.clientWidth || canvas.height * 1.5 > canvas.clientHeight ? 'smooth' : 'pixelated';
}

// Process each frame of the webcam feed
function processFrame() {
    ctx.save();
    if (flipImage) {
        ctx.scale(-1, 1);
        ctx.drawImage(video, -width, 0, width, height);
    } else {
        ctx.drawImage(video, 0, 0, width, height);
    }
    ctx.restore();

    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    // Greyscale the image using the luminance formula for sRGB
    const greyscaleData = new Float32Array(width * height);
    for (let i = 0; i < data.length; i += 4) {
        greyscaleData[i >>> 2] = .2126 * data[i] / 255 + .7152 * data[i + 1] / 255 + .0722 * data[i + 2] / 255;
    }

    function getPixelQuantised(x, y) {
        const i = y * width + x;
        switch (ditherSelection.value) {
            case 'none':
                return greyscaleData[i] > .5;
            case 'random':
                return greyscaleData[i] > Math.random();
            case 'ign':
                return greyscaleData[i] > 52.9829189 * ((.06711056 * x + .00583715 * y) % 1) % 1;
            case 'bayer2x2':
                return applyOrderedDithering(x, y, i, bayerMatrix2x2);
            case 'bayer4x4':
                return applyOrderedDithering(x, y, i, bayerMatrix4x4);
            case 'bayer8x8':
                return applyOrderedDithering(x, y, i, bayerMatrix8x8);
            case 'bayer16x16':
                return applyOrderedDithering(x, y, i, bayerMatrix16x16);
            case 'blueNoise16x16':
                return applyOrderedDithering(x, y, i, blueNoise16x16);
            case 'blueNoise32x32':
                return applyOrderedDithering(x, y, i, blueNoise32x32);
            case 'stucki':
                return applyStuckiDithering(x, y, i);
            case 'sierra':
                return applySierraDithering(x, y, i);
            case 'floydSteinberg':
                return applyFloydSteinbergDithering(x, y, i);
            case 'atkinson':
                return applyAtkinsonDithering(x, y, i);
            case 'jarvisJudiceNinke':
                return applyJarvisJudiceNinkeDithering(x, y, i);
        }
    }

    function applyOrderedDithering(x, y, i, matrix) {
        // The following two lines kind of fix ordered dithering for patternInterval > 1
        // x = Math.floor(x / patternInterval);
        // y = Math.floor(y / patternInterval);
        return greyscaleData[i] > matrix[x & (matrix.length - 1)][y & (matrix.length - 1)];
    }

    function applyStuckiDithering(x, y, i) {
        const oldPixel = greyscaleData[i];
        const newPixel = Math.round(oldPixel);
        const error = oldPixel - newPixel;

        if (x + 1 < width) greyscaleData[i + 1] += error * 8 / 42;
        if (x + 2 < width) greyscaleData[i + 2] += error * 4 / 42;
        if (y + 1 < height) {
            greyscaleData[i + width - 2] += error * 2 / 42;
            greyscaleData[i + width - 1] += error * 4 / 42;
            greyscaleData[i + width] += error * 8 / 42;
            greyscaleData[i + width + 1] += error * 4 / 42;
            greyscaleData[i + width + 2] += error * 2 / 42;
        }
        if (y + 2 < height) {
            greyscaleData[i + width * 2 - 1] += error / 42;
            greyscaleData[i + width * 2] += error * 2 / 42;
            greyscaleData[i + width * 2 + 1] += error / 42;
        }
        return newPixel === 1;
    }

    function applySierraDithering(x, y, i) {
        const oldPixel = greyscaleData[i];
        const newPixel = Math.round(oldPixel);
        const error = oldPixel - newPixel;

        if (x + 1 < width) greyscaleData[i + 1] += error * 5 / 32;
        if (x + 2 < width) greyscaleData[i + 2] += error * 3 / 32;
        if (y + 1 < height) {
            greyscaleData[i + width - 2] += error * 2 / 32;
            greyscaleData[i + width - 1] += error * 4 / 32;
            greyscaleData[i + width] += error * 5 / 32;
            greyscaleData[i + width + 1] += error * 4 / 32;
            greyscaleData[i + width + 2] += error * 2 / 32;
        }
        if (y + 2 < height) {
            greyscaleData[i + width * 2 - 1] += error * 2 / 32;
            greyscaleData[i + width * 2] += error * 3 / 32;
            greyscaleData[i + width * 2 + 1] += error * 2 / 32;
        }
        return newPixel === 1;
    }

    function applyFloydSteinbergDithering(x, y, i) {
        const oldPixel = greyscaleData[i];
        const newPixel = Math.round(oldPixel);
        const error = oldPixel - newPixel;

        if (x + 1 < width) greyscaleData[i + 1] += error * 7 / 16;
        if (x > 0 && y + 1 < height) greyscaleData[i + width - 1] += error * 3 / 16;
        if (y + 1 < height) greyscaleData[i + width] += error * 5 / 16;
        if (x + 1 < width && y + 1 < height) greyscaleData[i + width + 1] += error / 16;

        return newPixel === 1;
    }

    function applyAtkinsonDithering(x, y, i) {
        const oldPixel = greyscaleData[i];
        const newPixel = Math.round(oldPixel);
        const error = oldPixel - newPixel;

        if (x + 1 < width) greyscaleData[i + 1] += error / 8;
        if (x + 2 < width) greyscaleData[i + 2] += error / 8;
        if (x > 0 && y + 1 < height) greyscaleData[i + width - 1] += error / 8;
        if (y + 1 < height) greyscaleData[i + width] += error / 8;
        if (y + 1 < height && x + 1 < width) greyscaleData[i + width + 1] += error / 8;
        if (y + 2 < height) greyscaleData[i + width * 2] += error / 8;

        return newPixel === 1;
    }

    function applyJarvisJudiceNinkeDithering(x, y, i) {
        const oldPixel = greyscaleData[i];
        const newPixel = Math.round(oldPixel);
        const error = oldPixel - newPixel;

        if (x + 1 < width) greyscaleData[i + 1] += error * 7 / 48;
        if (x + 2 < width) greyscaleData[i + 2] += error * 5 / 48;
        if (x > 1 && y + 1 < height) greyscaleData[i + width - 2] += error * 3 / 48;
        if (x > 0 && y + 1 < height) greyscaleData[i + width - 1] += error * 5 / 48;
        if (y + 1 < height) greyscaleData[i + width] += error * 7 / 48;
        if (x + 1 < width && y + 1 < height) greyscaleData[i + width + 1] += error * 5 / 48;
        if (x + 2 < width && y + 1 < height) greyscaleData[i + width + 2] += error * 3 / 48;
        if (x > 1 && y + 2 < height) greyscaleData[i + width * 2 - 2] += error / 48;
        if (x > 0 && y + 2 < height) greyscaleData[i + width * 2 - 1] += error * 3 / 48;
        if (y + 2 < height) greyscaleData[i + width * 2] += error * 5 / 48;
        if (x + 1 < width && y + 2 < height) greyscaleData[i + width * 2 + 1] += error * 3 / 48;
        if (x + 2 < width && y + 2 < height) greyscaleData[i + width * 2 + 2] += error / 48;

        return newPixel === 1;
    }

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4;
            if (invertColours ^ getPixelQuantised(x, y) && ((x % patternInterval === 0 && y % patternInterval === 0) || ((x + 4) % patternInterval === 0 && (y + 4) % patternInterval === 0))) {
                data[i] = primaryColorRgb.r;
                data[i + 1] = primaryColorRgb.g;
                data[i + 2] = primaryColorRgb.b;
            } else {
                data[i] = secondaryColorRgb.r;
                data[i + 1] = secondaryColorRgb.g;
                data[i + 2] = secondaryColorRgb.b;
            }
        }
    }

    ctx.putImageData(imageData, 0, 0);
    requestAnimationFrame(processFrame);
}

// Helper functions
function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    return {
        r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255
    };
}

function saveCanvasAsSVG() {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">\n`;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const index = (y * width + x) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];
            const a = data[index + 3] / 255;
            if (a > 0) {
                svg += `<rect x="${x}" y="${y}" width="1" height="1" fill="rgba(${r},${g},${b},${a})" />\n`;
            }
        }
    }

    svg += '</svg>';

    const blob = new Blob([svg], {type: 'image/svg+xml'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pattern.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

async function fetchLatestCommit() {
    const response = await fetch('https://api.github.com/repos/thunderpoot/dotcam/commits/main');
    if (!response.ok) {
        console.error('Failed to fetch commit information (probably rate limited)');
        return;
    }

    const data = await response.json();
    const commitHash = data.sha.substring(0, 7); // Shorten the commit hash

    document.getElementById('commitHash').innerHTML = `<a href="https://github.com/thunderpoot/dotcam/commit/${data.sha}" target="_blank">${commitHash}</a>`;
}

