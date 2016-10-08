var nike = nike || {};nike.exp = nike.exp || {};nike.exp.dynamic = nike.exp.dynamic || {};nike.exp.dynamic.LocalValues = nike.exp.dynamic.LocalValues || {};!function(){function copyAllProperties(dest, src){var key;for(key in src){if(src.hasOwnProperty(key)){dest[key] = src[key];}}return dest;}nike.exp.dynamic.copyAllProperties = copyAllProperties;var localValueConfig = {"":"","buyingtools.width.wide":"宽掌版","mini-PDP.viewdetails":"查看详细信息","body.productDetail.style.number":"款式","outfitpdp.productDetailsLink":"查看全部商品细节","buyingtools.width.regular":"标准版","minipdp.details.button.text":"查看详细信息","minipdp.buyingtools.browseonly.note":"选择下方“查看详细信息”，将所有产品保存至心愿单。","pdp.sizeAndFit.fuelband.downloadSizingGuide":"下载尺码表","gridwall.preOrder":"预购","service.fit.country.label":"国家/地区：","pdp.sizeselect.label":"尺码","gridwall.comingSoon":"即将发售","service.fit.reviews.title":"客户评分","minipdp.buyingtools.browseonly.title":"保存至心愿单","pdp.countryOfOrigin":"原产国：","buyingtools.comingSoon":"即将发售","pdp.quantity.label":"数量","pdp.preorder.message.title":"第一时间抢购","pdp.tc.disclaimer":" ","pdp.tc.disclaimer.url":" ","pdp.error.cartTimeout.message":"抱歉，处理您的请求时出错，请重新加入购物车。","pdp.text.less":"收起","pdp.tc.disclaimer.link":" ","service.fit.fitGuide.title":"尺码表","pdp.nostock.title":"Nike官方网站上已售罄","pdp.addtocart.label":"加入购物车","mini-PDP.addtocart.message":"<div><strong>谢谢！</strong> 您的商品已成功加入购物车。 </div>","buyingtools.width.narrow":"窄掌版","pdp.overlayClose":"关闭","pdp.selected.colorWay.aria":"pdp.selected.colorWay.aria","gridwall.nostock":"已售罄","pdp.error.cartTimeout.title":"请重试","pdp.text.more":"更多","buyingtools.width.extraWide":"超宽掌版","pdp.colorWay.aria":"商品颜色:","pdp.sizeselect.ada.label":"选择尺码","pdp.microdata.price":"http://schema.org/Offer","pdp.preorder.label":"预购","pdp.nikeid.customize.nostock":"通过NIKEiD进行定制","pdp.preorder.messageTemplate.note":"采用标准配送方式。","body.productDetail.color.number":"颜色","pdp.sizeAndFit.fuelband.chooseThis":"选择该尺码","pdp.error.cartButton":"确定","buyingtools.availableSoon":"此商品即将发售。 请随时查看，以便第一时间抢购。","pdp.sizeAndFit.fuelband.sizingGuideUrl":"nikestore/merchandising/static/components/size_chart_documents/BandSizingGuide-NewSizes.pdf","buyingtools.accesscode.unlock":"取消锁定"};copyAllProperties(nike.exp.dynamic.LocalValues, localValueConfig);}();




try{
var nike = nike || {};
nike.namespace('nike.exp.global.PricingUtil');

/* Note: We aren't requiring nike.Cart here even though we use it.
 * nike.Cart is needed to update pricing based on usertype.
 * If it is missing (ex. server side rendering), we will display the DEFAULT_USER pricing.
 */
nike.requireDependency('lib.lodash');

nike.exp.global.PricingUtil = _.extend(nike.exp.global.PricingUtil, {

  truncatePrice : function(price) {
    return price ? price.replace(/(\.|,)00(\D|$)/, "$2") : "";
  },

  /**
   * Get the localPrice and overridden localPrice that should be displayed
   * @param userType The userType of the user viewing the page.  If undefined, use DEFAULT_USER
   * @param pricingInfo Object holding all the prices and pricing flags for this object
   *          fields: formattedListPrice, formattedSalePrice, formattedEmployeePrice, onSale, employeeDiscountAvailable
   * @param truncatePriceFlag flag indicating if decimal portion of price should be removed if it's 0.
   */
  getDisplayPrices : function(userType, pricingInfo, truncatePriceFlag) {
    var ret = {
      localPrice : pricingInfo.localPrice,
      onSale : pricingInfo.onSale,
      employeeDiscountAvailable : pricingInfo.employeeDiscountAvailable
    };

		var isEmployee = (
			userType
			&& nike.objectDefined('nike.Cart.UserType')
			&& (userType.toUpperCase() === nike.Cart.UserType.EMPLOYEE)
		) ? true : false;

    //If we don't know the user type or the userType is not an employee, return the list price
    if( isEmployee && ret.employeeDiscountAvailable ){
      ret.overriddenLocalPrice = pricingInfo.overriddenLocalPrice || pricingInfo.localPrice;
      ret.localPrice = pricingInfo.employeePrice;
      ret.isSwoosh = true;
    }else if( ret.onSale ){
			ret.overriddenLocalPrice = pricingInfo.overriddenLocalPrice;
		}

		ret.discounted = (ret.overriddenLocalPrice && !ret.isSwoosh) ? true : false;

    if(truncatePriceFlag === true){
      if( ret.overriddenLocalPrice ){
				ret.overriddenLocalPrice = nike.exp.global.PricingUtil.truncatePrice(ret.overriddenLocalPrice);
			}
			ret.localPrice = nike.exp.global.PricingUtil.truncatePrice(ret.localPrice);
    }

    //Return the price info
    return ret;
  },

  /**
   * On initial load of the page Swoosh pricing won't display since we need to check the user type.
   * This method will build out the pricing again now that we have access to the user type.
   * @param {Object} productData - The context needed to render the pricing markup.
   * @param {Function} template - Handlebars template used to render the pricing data.
   */
  setInitialSwooshPricing : function(productData, template){
    var $els = $('.exp-pdp-product-swoosh-price-available');
    if($els.length){
      $els.each(function(){
        var $el = $(this);
        var $newMarkup = $( template( productData ) );
        $el.closest('.exp-pdp-product-price-container').replaceWith( $newMarkup );
      });
    }
  }

});

}catch(ex){
if(nike.error){
nike.error('An unhandled exception was thrown while executing nike.exp.global.PricingUtil. Make sure to look for previous errors because this might have failed as a result of another script failing', ex, 'Stack:', ex.stack, 'Message:', ex.message);
}
}
try{
var nike = nike || {};
nike.namespace('nike.exp.global.templatehelpers.PricingHelpers');


nike.requireDependency('nike.exp.global.PricingUtil');
nike.requireDependency('lib.lodash');

!function(){


  /**
   * Block helper for displaying prices.
   * Available properties are overridenLocalPrice and LocalPrice
   *
   *
   * Usage will look something like this:
   *
   * {{#setupPricing "myPriceElementId" pricingInfo false}}
   *   <#if overriddenLocalPrice>
   *     <span class="overriddenPrice">{{overriddenLocalPrice}}</span>
   *   </if>
   *   <span class="displayPrice">{{localPrice}}</span>
   * {{/setupPricing}}
   *
   *
   * @param {string} elementSelector the id to give to this element.  This is needed incase we need to make a service call before rendering the price
   *
   * @param pricingInfo Object containing the following:
   *                      listPrice
   *                      affiliatePrice
   *                      employeePrice
   *                      overriddenPrice (salePrice)
   *                      onSale flag
   *                      isEmployeeDiscountAvailable flag
   *
   * @param {boolean}  truncatePrice - boolean indicating if the decimal portion of the price should be shown when it's .00.  Defaults to false.
   */
  Handlebars.registerHelper("setupPricing", function(elementSelector, pricingInfo, truncatePrice, markup){
    var userType = (nike.Cart && _.isFunction(nike.Cart.getUserType)) ? nike.Cart.getUserType() : undefined;
    var pricingMarkup = markup.fn(nike.exp.global.PricingUtil.getDisplayPrices(userType, pricingInfo, truncatePrice));
    //Wrap the markup in a span so we can add the selector
    return '<span class="' + elementSelector + '">' + pricingMarkup + '</span>';
  });
}();

}catch(ex){
if(nike.error){
nike.error('An unhandled exception was thrown while executing nike.exp.global.templatehelpers.PricingHelpers. Make sure to look for previous errors because this might have failed as a result of another script failing', ex, 'Stack:', ex.stack, 'Message:', ex.message);
}
}
try{
var nike = nike || {};
nike.namespace('nike.exp.global.ColorwayStatus');

nike.exp.global.ColorwayStatus = _.extend(nike.exp.global.ColorwayStatus, {
  IN_STOCK : 'IN_STOCK',
  PREORDER_IN_STOCK : 'PREORDER_IN_STOCK',
  COMING_SOON : 'COMING_SOON',
  OUT_OF_STOCK : 'OUT_OF_STOCK'
});

}catch(ex){
if(nike.error){
nike.error('An unhandled exception was thrown while executing nike.exp.global.ColorwayStatus. Make sure to look for previous errors because this might have failed as a result of another script failing', ex, 'Stack:', ex.stack, 'Message:', ex.message);
}
}
try{
var nike = nike || {};
nike.namespace('nike.exp.pdp.TemplateHelpers');

// Do not add dependencies for nike.Cart, jQuery or nike.Events.
// These are used if present on the page, but are null checked before use and are not required for the server side render.

nike.requireDependency('HandlebarsRuntime');
nike.requireDependency('JSON');
nike.requireDependency('nike.exp.global.TemplateHelpers');
nike.requireDependency('nike.exp.global.templatehelpers.PricingHelpers');
nike.requireDependency('nike.exp.global.LocalValueUtil');
nike.requireDependency('nike.exp.global.ColorwayStatus');

//Register all the template helpers needed for the pdp templates when this is loaded

!function () {
	/**
	 * Maximum of color options to show in one row. If there are 12 or less color options,
	 * show all color options and hide the caret to allow user to display more.
	 * If there are 13 or more colors to choose from, then ONLY show 11 swatches and also display the
	 * caret to allow user to show more.
	 */
	var MAX_COLOR_OPTIONS_PER_ROW = 6;
	var MAX_COLOR_OPTIONS_PER_ROW_SM_SCREEN = 4;
	var MAX_SWATCHES_PER_ROW = 10;
	var MAX_RATING_SCORE = 5;
	var IMAGE_BG_MAP = { heroImage: 'F5F5F5', altImage: 'F5F5F5', notifyMe: 'FFFFFF' };
	var IMAGE_BORDER_ARR = ["", "FFFFFF", "F9F7EA", "FFFCF4", "E5EAEE", "FFFOE3", "F7FBFA", "FAF8F4", "FAF8F0", "FFF8F7", "FFFBF4", "F7F7F7", "FFFAF5", "EFF4F8"];
	var isSwatchesAllowed = false;
	var IMAGE_PARAMS = {
		altImage: {
			hei: 60,
			wid: 60,
			fmt: 'jpeg',
			bgc: 'F5F5F5'
		},
		colorWay: {
			hei: 61,
			wid: 61,
			fmt: 'jpeg',
			bgc: 'F5F5F5'
		},
		medHeroImg: {
			hei: 460,
			wid: 460,
			fmt: 'jpeg',
			bgc: 'F5F5F5'
		},
		smallHeroImg: {
			hei: 380,
			wid: 380,
			fmt: 'jpeg',
			bgc: 'F5F5F5'
		},
		largeHeroImg: {
			hei: 620,
			wid: 620,
			fmt: 'jpeg',
			bgc: 'F5F5F5'
		}
	}


	/**
	 * Returns the template for the Main PDP Content (all the dynamic data)
	 */
	Handlebars.registerHelper("buildMainPdpContent", function (pdpData) {
		var markup = "";

		if (Handlebars.templates.MainPdpContent) {
			markup = Handlebars.templates.MainPdpContent({pdpData: pdpData});
		}

		return new Handlebars.SafeString(markup);
	});

	/**
	 * Get a property from the global nike.exp.dynamic.AppConfig
	 */
	Handlebars.registerHelper("getAppConfigProperty", function (propName) {
		var ret;
		if (nike &&
				nike.objectDefined &&
				nike.objectDefined('nike.exp.dynamic.AppConfig') &&
				nike.exp.dynamic.AppConfig[propName] !== undefined) {

			ret = nike.exp.dynamic.AppConfig[propName];
		}
		return ret;
	});

	/**
	 * Returns the mark up for the buying tools template
	 */
	Handlebars.registerHelper("buildBuyingTools", function (pdpData) {
		var buyingToolsMarkup = "";
		var fit = {
			available: ((pdpData.oneNikeSizeFit != '' || pdpData.fit != null) ? true : false),
			windowLocation: ((pdpData.oneNikeSizeFit != '') ? pdpData.oneNikeSizeFit : false)
		};
		var atLeastOneProductOutOfStock = false;
		var notifiableSkus = [];
		//Flag indicating if we have checked for inventory yet
		pdpData.inventoryChecked = pdpData.hasInventory !== undefined && pdpData.hasInventory !== null;

		for (var i = 0; i < pdpData.skuList.length; i++) {
			var currSku = pdpData.skuList[i];
			if (!currSku.inStock) {
				atLeastOneProductOutOfStock = true;
				notifiableSkus.push(currSku);
			}
		}

		if (Handlebars.templates.BuyingTools) {
			buyingToolsMarkup = Handlebars.templates.BuyingTools({ pdpData: pdpData, fit: fit, atLeastOneProductOutOfStock: atLeastOneProductOutOfStock });

			if (pdpData.accessCode && !pdpData.isUnlocked) {
				buyingToolsMarkup += Handlebars.templates.BuyingTools({
					markup: 'accessCodeModal',
					pid: pdpData.productId,
					baseStoreUrl: (nike.SERVICE_URLS.baseStoreURL + nike.COUNTRY + '/' + nike.LOCALE).toLowerCase()
				});
			}

			if (pdpData.notifyMe) {
				buyingToolsMarkup += Handlebars.templates.BuyingTools({
					markup: 'notifyMeModal',
					notifyMeData: pdpData,
					notifiableSkus: outOfStockSkus
				});
			}
		}

		return new Handlebars.SafeString(buyingToolsMarkup);
	});

	/**
	 * Type to hold info about a colorway section
	 * @typedef {object} ColorwayHeightInfo
	 * @property {number} expandedHeight
	 * @property {number} collapsedHeight
	 */

	/** EDF-16256
	 * Returns the mark up for the colorways template.
	 * If there are 12 (10 if product type is Apparel) or less total color options, show all of them in a row.
	 * EDF-16467
	 * show different groups of color variants (inStock, ComingSoon, PreOrder, OutOfStock)
	 *
	 * @param {object} pdpData
	 * @param {object} [pageData]
	 * @param {boolean} [pageData.isSmallScreen=false]
	 * @param {object} [pageData.colorwayHeightInfoMap] Map of current expanded and collapsed heights of colorway sections indexed by colorwayStatus
	 *   property - {ColorwayHeightInfo}
	 *
	 */
	Handlebars.registerHelper("buildColorways", function (pdpData, pageData) {
		var colorwaysMarkup = "",
				colorwayContext,
		//EDF-16194 apparel has color swatches and they display in rows of 10
				displaySwatches = pdpData.productType == "Apparel" && isSwatchesAllowed,
				isNFL = pdpData.league == "NFL" && pdpData.NFLJerseyType !== "",
				propName,
				currentColorwayList,
				colorwayLists,
				isSmallScreen = false, //Indicates if we should be using maxItems settings for small screens
				colorwayHeightInfoList; //List to indicate the collapsed and expanded heights for each colorway section

		// used for notify me link in Out of Stock message
		var atLeastOneProductOutOfStock = false;
		for (var i = 0; i < pdpData.skuList.length; i++) {
			var currSku = pdpData.skuList[i];
			if (!currSku.inStock) {
				atLeastOneProductOutOfStock = true;
				break;
			}
		}

		if (pageData) {
			isSmallScreen = pageData.isSmallScreen != undefined ? pageData.isSmallScreen : false;
			colorwayHeightInfoList = pageData.colorwayHeightInfoList;
		}

		//Separate colorways into lists by colorwayStatus
		colorwayLists = buildColorwayLists(pdpData.colorOptions);


		//Build colorway section markup for each colorway list.
		for (propName in colorwayLists) {
			if (colorwayLists.hasOwnProperty(propName)) {
				currentColorwayList = colorwayLists[propName];
				if (currentColorwayList.length > 0) {

					//Build context for this colorway list
					colorwayContext = buildContextForColorway({
						colorwayList: currentColorwayList,
						colorwayStatus: propName,
						selectedProductId: pdpData.productId,
						isSmallScreen: isSmallScreen,
						colorwayHeightInfo: colorwayHeightInfoList ? colorwayHeightInfoList[propName] : undefined,
						nikeIdMatch: pdpData.nikeIdMatch,
						nikeIdBuilderUrl: pdpData.nikeIdBuilderUrl,
						customColorwayGeneralMessage: pdpData.customColorwayGeneralMessage,
						customMessages: pdpData.customColorwayStatusMessages,
						preOrderMessageWithDate: pdpData.preOrderMessageWithDate,
						notifyMe: (pdpData.notifyMe && atLeastOneProductOutOfStock) ? true : false,
						pageData: pageData,
						hideColorWays: pdpData.hideColorWays
					});

					colorwaysMarkup += Handlebars.templates.Colorways(colorwayContext);
				}
			}
		}

		return new Handlebars.SafeString(colorwaysMarkup);


		//private functions
		/*********************
		 * Build colorway context for a single colorway object
		 *
		 * @param {object} config This is all the options
		 * @param {Array(object)} config.colorwayList colorwayList
		 * @param {string} config.colorwayStatus
		 * @param {string} config.selectedProductId
		 * @param {boolean}config.isSmallScreen
		 * @param {ColorwayHeightInfo} [config.colorwayHeightInfo]
		 * @param {boolean} [config.nikeIdMatch=false]
		 * @param {string} [config.nikeIdBuilderUrl]
		 * @param {string} [config.customColorwayGeneralMessage]
		 * @param {Array(string)} [config.customMessages]
		 *
		 *
		 */
		function buildContextForColorway(config) {
			var isPageLoad = true;
			if (pageData) {
				isPageLoad = false;
			}

			var customColorwayGeneralMessage,
					customMessage,
					title,
					maxItemsPerRow, //the max number of colorways to show per row
					maxItemsPerRowSmallScreen, //the max number of colorways to show per row on small screens
					isMultiRow = false, //Should multiple rows be shown
					displayColorwayControls = false,  //Should navigation controls be displayed for this set of colorways
					displayColorwayControlsOnSmallScreen = false, //Should navigation controls be displayed for this set of colorways on small screens
					inStock = config.colorwayStatus == nike.exp.global.ColorwayStatus.IN_STOCK,
					i, L, currentColorway, //Iterator and temp var for colorway loop
					isSelectedColorwayList = false,
					selectedColorwayIndex = -1, //The index of the selected product used to determine if we need to expand the colorway list
					expandedHeight; //If the section should render expanded (because the selected item is not visible collapsed) this is the height it should be set to.


			//Set max items per row based on if we are displaying swatches or not
			maxItemsPerRow = displaySwatches ? MAX_SWATCHES_PER_ROW : MAX_COLOR_OPTIONS_PER_ROW;
			maxItemsPerRowSmallScreen = MAX_COLOR_OPTIONS_PER_ROW_SM_SCREEN;

			//Setup displayColorwayControl flags based on if there are too many products to display without needing to scroll.
			if (inStock) {
				//Double max items per row because inStock shows two rows.
				maxItemsPerRow *= 2;
				maxItemsPerRowSmallScreen *= 2;
			}
			displayColorwayControls = config.colorwayList.length > maxItemsPerRow;
			displayColorwayControlsOnSmallScreen = config.colorwayList.length > maxItemsPerRowSmallScreen;

			//Setup default height class if we aren't displaying color swatches.  IN_STOCK products can have two rows, all others only have one.
			if (!displaySwatches) {

				if (!isSmallScreen) {
					isMultiRow = config.colorwayList.length > MAX_COLOR_OPTIONS_PER_ROW && inStock;
				} else {
					isMultiRow = config.colorwayList.length > MAX_COLOR_OPTIONS_PER_ROW_SM_SCREEN && inStock;
				}

			}

			//Setup flags for selected and if colorway should have a border
			for (i = 0, L = config.colorwayList.length; i < L; i++) {
				currentColorway = config.colorwayList[i];

				//If the current colorway is selected set a flag on it
				if (currentColorway.productId == config.selectedProductId) {
					isSelectedColorwayList = true;
					currentColorway.selected = true;
					selectedColorwayIndex = i;
				}

				//If this is being displayed as as swatch and the swatch color requires a border, make sure it's added
				if (displaySwatches && currentColorway.swatchColorHex &&
						IMAGE_BORDER_ARR.indexOf(currentColorway.swatchColorHex.toUpperCase()) !== -1) {
					currentColorway.hasBorder = true;
				}
			}


			//Add custom messages
			// update the markup from the CMS to match StyleGuide

			if (isSelectedColorwayList && config.customColorwayGeneralMessage) {
				customColorwayGeneralMessage = config.customColorwayGeneralMessage.replace('<div>', '<div class="exp-title nsg-font-family--platform">');
			}

			if (config.customMessages[config.colorwayStatus]) {
				customMessage = config.customMessages[config.colorwayStatus].replace('<div>', '<div class="exp-title nsg-font-family--platform">');
			}


			//Setup title based on colorwayStatus
			switch (config.colorwayStatus) {
				case nike.exp.global.ColorwayStatus.PREORDER_IN_STOCK:
					title = nike.exp.global.LocalValueUtil.getLocal("gridwall.preOrder");
					break;

				case nike.exp.global.ColorwayStatus.COMING_SOON:
					title = nike.exp.global.LocalValueUtil.getLocal("gridwall.comingSoon");
					break;

				case nike.exp.global.ColorwayStatus.OUT_OF_STOCK:
					title = nike.exp.global.LocalValueUtil.getLocal("gridwall.nostock");
					break;

				default:
					break;
			}

			//Check if we have an expanded height value and we need to set the expanded height for the current colorway section
			if (config.colorwayHeightInfo && config.colorwayHeightInfo.expandedHeight &&
					showColorwayExpanded(selectedColorwayIndex, isSmallScreen ? maxItemsPerRowSmallScreen : maxItemsPerRow, config.colorwayList.length)) {
				expandedHeight = config.colorwayHeightInfo.expandedHeight;
			}

			return  {
				displayColorwayControls: displayColorwayControls,
				displayColorwayControlsOnSmallScreen: displayColorwayControlsOnSmallScreen,
				displaySwatches: displaySwatches,
				isMultiRow: isMultiRow,
				selectedProductId: config.selectedProductId,
				title: title,
				status: config.colorwayStatus,
				inStock: inStock,
				showPreorderMessage: isSelectedColorwayList && config.colorwayStatus == nike.exp.global.ColorwayStatus.PREORDER_IN_STOCK,
				showComingSoonMessage: isSelectedColorwayList && config.colorwayStatus == nike.exp.global.ColorwayStatus.COMING_SOON,
				showOutOfStockMessage: isSelectedColorwayList && config.colorwayStatus == nike.exp.global.ColorwayStatus.OUT_OF_STOCK,
				colorOptions: config.colorwayList,
				displayNikeIdLinkForOutOfStock: config.nikeIdMatch && config.colorwayStatus == nike.exp.global.ColorwayStatus.OUT_OF_STOCK,
				nikeIdMatch: config.nikeIdMatch,
				nikeIdBuilderUrl: config.nikeIdBuilderUrl,
				customColorwayGeneralMessage: customColorwayGeneralMessage,
				customMessage: customMessage,
				isNFL: isNFL,
				notifyMe: pdpData.notifyMe,
				atLeastOneProductOutOfStock: atLeastOneProductOutOfStock,
				expandedHeight: expandedHeight,
				preOrderMessageWithDate: config.preOrderMessageWithDate,
				isPageLoad: isPageLoad,
				hideColorWays: config.hideColorWays
			};
		}


		/**
		 * Determine if we should show the colorway section expanded so the selected product is visible in the colorway list
		 *
		 * @param {integer} selectedColorwayIndex
		 * @param {integer} maxItemsPerRow
		 */
		function showColorwayExpanded(selectedColorwayIndex, maxItemsPerRow, totalColors) {
			var ret = false;
			//Check if selectedProduct is not visible when the section is collapsed
			//A dropdown arrow appears in the last item slot if there more color options than maxItemsPerRow, so we subtract 1 from the maxItems when comparing to the selected index.
			if (selectedColorwayIndex >= maxItemsPerRow - 1 && totalColors > maxItemsPerRow) {
				ret = true;
			}
			return ret;
		}

		/**
		 * Split up colorway list into separate lists by colorwaysStatus
		 */
		function buildColorwayLists(allColorways) {

			var i, L;

			//Build colorway lists
			var inStockColorways = [];
			var preorderColorways = [];
			var comingSoonColorways = [];
			var outOfStockColorways = [];

			for (i = 0, L = allColorways.length; i < L; i++) {
				switch (allColorways[i].status) {
					case 'IN_STOCK':
						inStockColorways.push(allColorways[i]);
						break;

					case 'PREORDER_IN_STOCK':
						preorderColorways.push(allColorways[i]);
						break;

					case 'COMING_SOON':
						comingSoonColorways.push(allColorways[i]);
						break;

					case 'OUT_OF_STOCK':
						outOfStockColorways.push(allColorways[i]);
						break;

					default:
						break;
				}
			}
			return { 'IN_STOCK': inStockColorways, 'PREORDER_IN_STOCK': preorderColorways, 'COMING_SOON': comingSoonColorways, 'OUT_OF_STOCK': outOfStockColorways};
		}

	});


	Handlebars.registerHelper("determineArrowClasses", function (altImages) {
		var vertImageBreak = 7;
		var horizontalImageBreak = 6;
		var showVerticalArrows = altImages.length > vertImageBreak;
		var showHorizontalArrows = altImages.length > horizontalImageBreak;
		var arrowClasses = showVerticalArrows ? ' exp-pdp-show-vert-arrows ' : ' ';
		arrowClasses += showHorizontalArrows ? ' exp-pdp-show-horiz-arrows ' : ' ';

		return arrowClasses;
	});

	Handlebars.registerHelper("determineViewportClasses", function (altImages) {
		var imageCount = altImages.length;
		var viewportClasses = "";
		if (imageCount == 7) {
			viewportClasses += " seven-images";
    } else if(imageCount == 6){
      viewportClasses += " six-images";
		} else if (imageCount == 5) {
			viewportClasses += " five-images";
		} else if (imageCount <= 4) {
			viewportClasses += " four-or-less-images";
		}

		return viewportClasses;
	});

	Handlebars.registerHelper("generatePdpImageActiveClass", function (index) {
		return index == 0 ? "exp-pdp-active" : '';
	});

	Handlebars.registerHelper("getBgColor", function (image) {
		return IMAGE_BG_MAP[image];
	});

	Handlebars.registerHelper("getImageParams", function (typeString) {
		var params = "?";
		var imageParamObj = IMAGE_PARAMS[typeString];
		var indexholder = 0;
		for (var param in imageParamObj) {
			if (indexholder != 0) {
				params += '&';
			}
			params += param + "=" + imageParamObj[param];
			indexholder++;
		}
		;
		return params;
	});

	Handlebars.registerHelper("buildWidthSelector", function (pdpData) {
		var reg = new RegExp('pid\\-\\d+\\/pgid\\-\\d+');
		var baseURL = pdpData.pdpUrl;

		var widths = {
			narrow: {
				width: 'NARROW',
				groupId: pdpData.narrowWidthProductGroupId,
				productId: pdpData.narrowWidthMainColorwayProductId,
				label: nike.exp.global.LocalValueUtil.getLocal('buyingtools.width.narrow')
			},
			regular: {
				width: 'REGULAR',
				groupId: pdpData.regularWidthProductGroupId,
				productId: pdpData.regularWidthMainColorwayProductId,
				label: nike.exp.global.LocalValueUtil.getLocal('buyingtools.width.regular')
			},
			wide: {
				width: 'WIDE',
				groupId: pdpData.wideWidthProductGroupId,
				productId: pdpData.wideWidthMainColorwayProductId,
				label: nike.exp.global.LocalValueUtil.getLocal('buyingtools.width.wide')
			},
			extraWide: {
				width: 'EXTRAWIDE',
				groupId: pdpData.extraWideWidthProductGroupId,
				productId: pdpData.extraWideWidthMainColorwayProductId,
				label: nike.exp.global.LocalValueUtil.getLocal('buyingtools.width.extraWide')
			}
		};
		var widthSelectorMarkup = "<ul " + Handlebars.helpers.buildQaAttr.call(this, 'pdp.widthselector.container') + ">";
		var numberOfWidths = 0;
		var width, widthOption, widthProductId, widthGroupId, selectedClass, qaAttr, pgidAttr, pidAttr, hrefAttr;

		for (width in widths) {
			widthOption = widths[width];
			if (widths.hasOwnProperty(width) && ( widthOption.productId || (widthOption.width === pdpData.width) )) {
				numberOfWidths++;
				widthProductId = widthOption.productId || pdpData.productId;
				pidAttr = ' data-productid="' + widthProductId + '"';
				widthGroupId = (widthOption.groupId == pdpData.productGroupId) ? '' : widthOption.groupId;
				pgidAttr = widthGroupId ? ' data-productgroupid="' + widthGroupId + '"' : '';
				selectedClass = (widthOption.width === pdpData.width) ? "selected" : "";
				qaAttr = Handlebars.helpers.buildQaAttr.call(this, 'pdp.' + widthOption.width.toLowerCase() + '.width');
				hrefAttr = ' href="' + baseURL.replace(reg, 'pid-' + widthProductId + '/pgid-' + widthGroupId) + '"';

				widthSelectorMarkup += "<li class='nsg-font-family--platform-i " + selectedClass + "'>" +
						"<a class=\"exp-pdp-width-option\"" + hrefAttr + pidAttr + pgidAttr + qaAttr + ">" + widthOption.label + "</a></li>";
			}
		}

		widthSelectorMarkup = (numberOfWidths > 1) ? widthSelectorMarkup + "</ul>" : "";

		return new Handlebars.SafeString(widthSelectorMarkup);
	});

	/**
	 * Returns the mark up for VAT Message for German locale
	 */
	Handlebars.registerHelper("buildVATMessage", function () {
		var VATMessage = "";
		var featureFlags = nike.FEATURE_LIST;

		if (featureFlags['TAX_DISCLAIMER']) {
			var qaVATAttr = Handlebars.helpers.buildQaAttr.call(this, 'pdp.vat.message.tc');
			var qaUrlAttr = Handlebars.helpers.buildQaAttr.call(this, 'pdp.vat.tc.url');
			VATMessage = "<div class='exp-message-container vat-message'>" +
					"<div class='exp-pdp-tc-disclaimer base-font' " + qaVATAttr + ">" + nike.exp.global.LocalValueUtil.getLocal('pdp.tc.disclaimer') +
					"<a href=\"" + nike.exp.global.LocalValueUtil.getLocal('pdp.tc.disclaimer.url') + "\" class='exp-pdp-tc-disclaimer-url'" + qaUrlAttr + ">" +
					" " + nike.exp.global.LocalValueUtil.getLocal('pdp.tc.disclaimer.link') + "</a>" + "." +
					"</div>" +
					"</div>"
		}
		return new Handlebars.SafeString(VATMessage);
	});


	/**
	 * Returns the mark up for the product review stars
	 */
	Handlebars.registerHelper("productReviewStars", function (pdpData) {
		var helperMarkup = "";

		if (Handlebars.templates.ProductReviewStars) {
			pdpData.reviewClass = (pdpData.hasReviews) ? 'has-reviews' : 'no-reviews';
			pdpData.qaAttribute = 'pdp.reviews.' + pdpData.reviewClass;
			helperMarkup = Handlebars.templates.ProductReviewStars({pdpData: pdpData});
		}

		return new Handlebars.SafeString(helperMarkup);
	});

	/**
	 * @param   <Number> averageRating  A products rating.
	 * @return  <String> Percentage     for the width of the rating span
	 */
	Handlebars.registerHelper("ratingsPercentage", function (averageRating) {
		return new Handlebars.SafeString(((averageRating / MAX_RATING_SCORE) * 100) + '%');
	});

	/**
	 * Returns the mark up for the hero product image
	 */
	Handlebars.registerHelper("buildHeroProductImage", function (pdpData) {
		var mainImagesMarkup = "";

		if (Handlebars.templates.HeroProductImage) {
			mainImagesMarkup = Handlebars.templates.HeroProductImage({pdpData: pdpData})
		}

		return new Handlebars.SafeString(mainImagesMarkup);
	});

	/**
	 * Builds and returns the product color name and style number
	 */
	Handlebars.registerHelper("buildStyleColorInfo", function (pdpData) {
		var description = (pdpData.colorDescription) ? '<span class="colorText">' + pdpData.colorDescription + '</span><span class="comma">, </span>' : '';
		var styleInfo = nike.exp.global.LocalValueUtil.getLocal('body.productDetail.style.number') + " - " +
				nike.exp.global.LocalValueUtil.getLocal('body.productDetail.color.number') + " " +
				pdpData.styleNumber + "-" + pdpData.colorNumber;

		return new Handlebars.SafeString(description + '<div class="colorNum">' + styleInfo + '</div>');
	});

	/**
	 * Build and return NFL CrossSellGadget
	 */
	Handlebars.registerHelper("getRecommendationScheme", function (pdpData) {
		var scheme = 'product_rr';
		// US is the only country that has a different scheme for NFL
		if (nike.COUNTRY == "US" && "NFL" == pdpData.league.toUpperCase() && "APPAREL" == pdpData.productType.toUpperCase()) {
			//Gender 1-Men 2-Women 3-Kids
			scheme = (pdpData.gender == 3) ? 'nfljerseykidspdp_rr' : 'nfljerseypdp_rr';
		}
		return new Handlebars.SafeString(scheme);
	});
	Handlebars.registerHelper("getRecommendationCount", function (league) {
		var recommendationCount = ("NFL" == league.toUpperCase()) ? 6 : 4;
		return new Handlebars.SafeString(recommendationCount);
	});
	Handlebars.registerHelper("getRecommendationTeamName", function (teamName) {
		var recommendationTeamName = ("" == teamName) ? "" : 'data-nfl-team-name="' + teamName + '"';
		return new Handlebars.SafeString(recommendationTeamName);
	});

	/**
	 * Returns the mark up for the customizeCTA
	 */
	Handlebars.registerHelper("buildCustomizeCTA", function (pdpData) {
		var markup = "";
		var dims = { width: 190, height: 106 };
		// trimming the customImages down to 3
		if (pdpData.customizeImages) {
			pdpData.customizeImages = pdpData.customizeImages.slice(0, 3);
		}

		if (Handlebars.templates.CustomizeCTA) {
			markup = Handlebars.templates.CustomizeCTA({pdpData: pdpData, dims: dims});
		}

		return new Handlebars.SafeString(markup);
	});

	Handlebars.registerHelper("buildGiftCardUrl", function () {
		return nike.getRootUrl() + nike.COUNTRY.toLowerCase() +
				"/" + nike.LOCALE.toLowerCase() + "/?l=shop,gift_cards";
	});

	Handlebars.registerHelper("buildCrossSell", function () {
		var markup = Handlebars.templates.CrossSell();
		return new Handlebars.SafeString(markup);
	});

	Handlebars.registerHelper("buildSocialMarkup", function (obj) {
		var markup = "";

		if (Handlebars.templates.SocialTools) {
			obj.lang = nike.LANGUAGE;
			markup = Handlebars.templates.SocialTools(obj);
		}

		return new Handlebars.SafeString(markup);

	});

	/**
	 * Returns the template for the Size and Fit Content (all the dynamic data)
	 */
	Handlebars.registerHelper("buildSizeAndFitContent", function (pdpData) {
		var markup = "";
		//EDF-19463
		//This not being an object was breaking Object.keys causing the size and fit guide to break.
		//So I simply made it an object, sometimes it can come back as null and that is what would break it.
		var localizedCountryObject = typeof pdpData.fit.sizeCharts[0].localizedCountriesMap == Object ? pdpData.fit.sizeCharts[0].localizedCountriesMap : {};
		var values = {sizeCharts: pdpData.fit.sizeCharts,
			isSingleCountryMap: Object.keys(localizedCountryObject).length == 1 ? true : false,
			preSelectedCountry: pdpData.fit.sizeCharts[0].countryToPreselect,
			measureInstructions: pdpData.fit.measureInstructions,
			fitInstructions: pdpData.fit.fitInstructions,
			fitGuideList: pdpData.fitGuideList,
			isMultiRowSizeChart: pdpData.fit.sizeCharts[0].sizemaps[0].rowSet[0].rows.length > 1 ? true : false,
			multiRowSizeChart: pdpData.fit.sizeCharts[0].sizemaps[0].rowSet[0].rows.length > 1 ? true : false,
			isFitGuideListAvailable: pdpData.fitGuideList.length > 0 ? true : false,
			isReviewContainer: pdpData.reviewContainer > 0 ? true : false,
			isMeasureInstructions: pdpData.fit.measureInstructions != null ? true : false,
			isFitInstructions: pdpData.fit.fitInstructions.length > 0 ? true : false,
			isFuelBandSizeChart: (pdpData.fit.sizeCharts[0].title.toLowerCase().indexOf("fuelband") != -1) ? true : false,
			fuelBandTitle: pdpData.fit.sizeCharts[0].title,
			isBraSizeChart: (pdpData.fit.sizeCharts[0].id.toLowerCase().indexOf("brasize") != -1) ? true : false,
			braSizeChart: (pdpData.fit.sizeCharts[0].id.toLowerCase().indexOf("brasize") != -1) ? true : false,
			skuList: pdpData.skuList,
			showCountryDropDown: ((pdpData.fit.sizeCharts[0].title.toLowerCase().indexOf("fuelband") != -1) || (pdpData.fit.sizeCharts[0].id.toLowerCase().indexOf("brasize") != -1)) ? true : false,
			baseModulesURL: nike.getServiceUrl('baseModulesURL'),
			baseStoreUrl: nike.getServiceUrl('baseStoreURL'),
			overlayClose: nike.exp.global.LocalValueUtil.getLocal('pdp.overlayClose'),
			fitGuideTitle: nike.exp.global.LocalValueUtil.getLocal('service.fit.fitGuide.title'),
			reviewsTitle: nike.exp.global.LocalValueUtil.getLocal('service.fit.reviews.title'),
			fitCountryLabel: nike.exp.global.LocalValueUtil.getLocal('service.fit.country.label'),
			fuelBandLabel: nike.exp.global.LocalValueUtil.getLocal('pdp.sizeAndFit.fuelband.chooseThis'),
			sizeGuideUrl: nike.exp.global.LocalValueUtil.getLocal('pdp.sizeAndFit.fuelband.sizingGuideUrl'),
			downloadSizingGuide: nike.exp.global.LocalValueUtil.getLocal('pdp.sizeAndFit.fuelband.downloadSizingGuide')
		};

		if (Handlebars.templates.SizeAndFitChart) {
			markup = Handlebars.templates.SizeAndFitChart(values);
		}else if(Handlebars.templates.LegacySizeAndFitChart){
			markup = Handlebars.templates.LegacySizeAndFitChart(values);
		}

		return new Handlebars.SafeString(markup);
	});

	/**
	 * Block helper that takes the video ID and matches it with one of the thumbnail images from the
	 * VideoImagesResult object and then builds the image object in the template.
	 */
	Handlebars.registerHelper("getMatchingVideo", function (assetId, context, options) {
		var fn = options.fn,
				inverse = options.inverse,
				i = 0,
				ret = "";
		var data;

		if (options.data) {
			data = Handlebars.createFrame(options.data);
		}

		if (context && typeof context === 'object') {
			for (var j = context.length; i < j; i++) {
				if (context[i].id == assetId) {
					if (data) {
						data.index = i;
					}
					ret = ret + fn(context[i], { data: data });
				}
			}
		}

		if (i === 0) {
			ret = inverse(this);
		}
		return ret;
	});


	/**
	 * This block helper checks if Access Code is enabled and if the page is lucked.
	 * Will pass only if accessCode is true AND isUnlocked is false
	 */
	Handlebars.registerHelper("ifAccessCodeLocked", function (isAccessCodeEnabled, isUnlocked, options) {
		if (isAccessCodeEnabled && !isUnlocked) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	});

	Handlebars.registerHelper("getPlayerOption", function (productDetail, player) {
		var markup = "",
				selected = "",
				classes,
				productId = "",
				productGroupId = "",
				selectedPlayerName = productDetail.nflAthleteName;

		if (player.name == selectedPlayerName) {
			selected = "selected";
		} else if (player.jersey.colorNumber == productDetail.colorNumber && player.jersey.styleNumber == productDetail.styleNumber) {
			selected = "selected";
		}


		if (player) {
			classes = player.jersey.status == "IN_STOCK" ? "" : "class=not-in-stock ";
			productId = player.jersey.productId;
			productGroupId = player.productGroupId ? player.productGroupId : productDetail.productGroupId;

			markup = "<option " + classes + " data-productid=" + productId
					+ " data-link=" + player.jersey.pdpUrl
					+ " " + selected
					+ " data-productgroupid=" + productGroupId + " " + "> " + player.name + "</option>";
		} else {
			markup = "";
		}

		return new Handlebars.SafeString(markup);
	});

	Handlebars.registerHelper("ifPrimarySportGolf", function (pdpData, options) {
		var isGolf = false;

		if (pdpData.primarySportName.toUpperCase() == "GOLF") {
			isGolf = true;
		} else if ((pdpData.primarySportName == "" || pdpData.primarySportName == "undefined") && pdpData.primarySportCode == "8") {
			isGolf = true;
		}

		if (isGolf) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}

	});

	/*********************************************
	 *             Utility Helpers                *
	 *********************************************/

	/**
	 * This is a block helper so you must add a "#" before compare.
	 * eg. {{#compare something "==" somethingelse}}<!--stuff to show here -->{{/compare}}
	 * If you only use two values (without putting in an operator), then it defaults to "===".
	 */
	Handlebars.registerHelper("compare", function (lvalue, operator, rvalue, options) {

		var operators,
				result;

		if (arguments.length < 3) {
			throw new Error("Handlerbars Helper 'compare' needs 3 parameters");
		}

		if (options === undefined) {
			options = rvalue;
			rvalue = operator;
			operator = "===";
		}

		operators = {
			'==': function (l, r) {
				return l == r;
			},
			'===': function (l, r) {
				return l === r;
			},
			'&&': function (l, r) {
				return l && r;
			},
			'!=': function (l, r) {
				return l != r;
			},
			'!==': function (l, r) {
				return l !== r;
			},
			'<': function (l, r) {
				return l < r;
			},
			'>': function (l, r) {
				return l > r;
			},
			'<=': function (l, r) {
				return l <= r;
			},
			'>=': function (l, r) {
				return l >= r;
			},
			'typeof': function (l, r) {
				return typeof l == r;
			}
		};

		if (!operators[operator]) {
			throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + operator);
		}

		result = operators[operator](lvalue, rvalue);

		if (result) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	});

	/**
	 * @return  <String> String with search term replaced
	 */
	Handlebars.registerHelper("SearchReplace", function (value, searchTerm, replaceTerm) {
		return value.replace(/searchTerm/, /replaceTerm/);
	});

	/**
	 * Checks the renderDataQA attribute. If set to true, inserts the data-qa attribute
	 * for automation. Requires the attribute value to be passed in as dataQaValue parameter.
	 *
	 * Also allows passing in an index for cases where you are creating a series of objects.
	 * Doing so will result in the index value + 1 in the output.
	 *
	 * Usage examples:
	 * {{buildQaAttr "foo"}} would become: data-qa="foo"
	 * {{buildQaAttr "foo_" @index}} where the current index=0 would become: data-qa="foo_1"
	 */

	Handlebars.registerHelper("buildQaAttr", function (dataQaValue, index) {
		var attribute;
		var qaValue = dataQaValue;

		if (typeof index === "number") {
			qaValue += (index + 1);
		}

		if (nike.ENV_CONFIG && nike.ENV_CONFIG.renderDataQA == "true") {
			attribute = nike.DATA_QA + '="' + qaValue + '"';
		} else {
			attribute = "";
		}
		return new Handlebars.SafeString(attribute);
	});

	/**
	 * Adds the height and width attributes that are passed in as params to the image URL
	 * for the purposes of requesting the right size from scene7. Outputs the image as JPG.
	 *
	 * Usage example:
	 * {{resizeImage imageUrl 300 200}}
	 * Output:
	 * http://imageUrl?fmt=jpg&qty=85&wid=300&hei=200
	 *
	 * Can take a parameter for the background color. The available parameter options for
	 * the colorKey are defined in the IMAGE_BG_MAP object.
	 */
	Handlebars.registerHelper("resizeImage", function (imageUrl, w, h, colorKey) {
		var bgc = (IMAGE_BG_MAP[colorKey]) ? '&bgc=' + IMAGE_BG_MAP[colorKey] : '';

		return imageUrl.split('?')[0] + "?fmt=jpg&qty=85&wid=" + w + "&hei=" + h + bgc;
	});

	/**
	 * Generates the image for the CTA section that's generated from scene7
	 */
	Handlebars.registerHelper("generateCtaImage", function (imgURL, w, h) {
		return imgURL.replace(/&(.*)/, '?wid=' + w + '&hei=' + h + '&fmt=jpg&qty=85');
	});

	/**
	 * This acts as a for loop in Handlebars.  The block variable is whatever is
	 * contained between the opening and closing tags (e.g. {{#for 1 10}}block{{/for}})
	 */
	Handlebars.registerHelper("for", function (from, to, block) {
		var accum = '';
		for (var i = from; i <= to; i++) {
			accum += block.fn(i);
		}
		return accum;
	});

	/**
	 * Stringify a JS object
	 */
	Handlebars.registerHelper("stringify", function (object) {
    return JSON.stringify(object);
	});

	Handlebars.registerHelper("buildStepListDecorator", function (step) {
		var stepString = "";
		var stringStep = step.toString();

		if (stringStep.indexOf("<li>") != -1 || stringStep.indexOf("<ul>") != -1) {
			stepString = stringStep;
			//return new Handlebars.SafeString(step);
		} else if (step.indexOf("<p>") == -1) {
			stepString = "<p>" + stringStep + "</p>";
		} else if (stringStep == "" || stringStep == " ") {
			stepString = "";
		} else {
			stepString = stringStep;
		}
		return new Handlebars.SafeString(stepString);

	});

	Handlebars.registerHelper("foreach", function (arr, options) {
		if (options.inverse && !arr.length) {
			return options.inverse(this);
		}

		return _.map(arr,function (item, index) {
			item.$index = index;
			item.$first = index === 0;
			item.$second = index === 1;
			item.$last = index === arr.length - 1;
			return options.fn(item);
		}).join('');
	});

	Handlebars.registerHelper("isOddRow", function (rawValue, options) {
		var rawValue = rawValue + 1; //index starts with 0, so making it start with 1
		if (+rawValue % 2) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	});

	Handlebars.registerHelper("splitBySlash", function (value) {
		if (value.length > 10) {
			return value.split("/").join(' /');
		}
		return value;
	});

	Handlebars.registerHelper("displayPdpPricingTemplate", function (pdpData) {
		var markup = "";
		if (Handlebars.templates.DisplayPdpPricing) {
			markup = Handlebars.templates.DisplayPdpPricing({pdpData: pdpData})
		}

		return new Handlebars.SafeString(markup);
	});

	Handlebars.registerHelper("setIndex", function (value) {
		this.index = Number(value);
	});

	Handlebars.registerHelper("replaceCSSClassName", function (txt) {
		return (txt != null && txt != undefined) ? txt.split(' ').join('-').toLowerCase() : '';
	});

	Handlebars.registerHelper("rowSpanHelper", function (rows) {
		return rows.length;
	});

	Handlebars.registerHelper("htmlElementParser", function (element) {
		return new Handlebars.SafeString(element);
	});

	Handlebars.registerHelper("changeToClassName", function (someString) {
		var someClassName = "exp-pdp-";
		var stringHolder = [];
		stringHolder = someString.split(' ');
		for (var i = 0; i < stringHolder.length; i++) {
			someClassName += stringHolder[i].toLowerCase();
			//using index to make sure this isn't the last one
			if (stringHolder.length - 1 != i) {
				someClassName += "-";
			}
		}
		return someClassName
	});


	Handlebars.registerHelper("buildNFLLandingURL", function (slugName) {
		var rootUrl = nike.getServiceUrl("baseBrandURL") + nike.COUNTRY.toLowerCase() + "/" + nike.LOCALE.toLowerCase() + "/";
		var buildUrl = rootUrl + "c/nfl/";

		if (slugName !== "NFLlogo") {
			buildUrl += slugName.split(' ').join('-').toLowerCase();
		}

		return buildUrl;
	});

	Handlebars.registerHelper("buildCountryOfOrigin", function (countryList) {
		var labelStr = nike.exp.global.LocalValueUtil.getLocal('pdp.countryOfOrigin') + ' ';
		if (countryList != null && countryList.length > 0) {
			if (countryList.length == 1) {
				return labelStr + countryList[0];
			} else {
				var corStr = countryList[0];
				for (var i = 1; i < countryList.length; i++) {
					corStr = corStr + ', ' + countryList[i];
				}
				return labelStr + corStr;
			}
		}
		return '';
	});

	/**
	 * Changing Slug to "sm" for share urls
	 * EDF-19603
	 */
	Handlebars.registerHelper("socialMediaHelper", function (url) {
		var REGEX_FOR_SLUG = /(^.*pd\/).*(\/pid.*)/i;
		var newUrl = url;
		var arr = REGEX_FOR_SLUG.exec(url);
		if (arr) {
			newUrl = arr[1] + "sm" + arr[2];
		}
		return new Handlebars.SafeString(newUrl);
	});
}();


}catch(ex){
if(nike.error){
nike.error('An unhandled exception was thrown while executing nike.exp.pdp.TemplateHelpers. Make sure to look for previous errors because this might have failed as a result of another script failing', ex, 'Stack:', ex.stack, 'Message:', ex.message);
}
}

try{
var nike = nike || {};
nike.namespace('nike.exp.pdp.base.ViewModule', function(){
  var _ = nike.requireDependency('lib.lodash');
  var $ = nike.requireDependency('jQuery');

  /**
   * Handlebars helper to pull in a sub-view defined in a ViewModule.
   * @param {Object} data object for populating the module template.
   * @param {String} fully qualified class name of ViewModule subclass.
   * @param {String} unique id for this view.
   */
  Handlebars.registerHelper('viewModule', function(viewModel, moduleClassName, viewId){
    var ModuleClass = ViewModuleUtils.getClassByName(moduleClassName);
    if (ModuleClass) {
      var module = new ModuleClass();
      if (Handlebars.templates[module.template]) {
        var content = '';
        if (viewModel) {
          content = Handlebars.templates[module.template](viewModel);
        }
        return new Handlebars.SafeString('<div data-module="' + moduleClassName + '" data-id="' + viewId + '">' + content + '</div>');
      }
      return 'template "' + module.template + '" not found for ViewModule: ' + moduleClassName + '.';
    }
    return 'ViewModule class: ' + moduleClassName + ' not found.';
  });

  var EVENT_SPLITTER_REGEX = /^(\S+)\s*(.*)$/;
  var EVENT_NS = "delegateEvent";

  var ViewModuleUtils = {

    getClassByName: function(className){
      return nike.objectDefined(className, null, true);
    },

    // utility method for parsing @ui. syntax strings
    // into associated selector (from Backbone.Marionette)
    normalizeUIString: function (uiString, ui) {
      return uiString.replace(/@ui\.[a-zA-Z_$0-9]*/g, function (r) {
        return ui[r.slice(4)];
      });
    }
  };

  return Class.extend({

    init: function() {
      this.template = null;
      this.viewModel = null;
      this.$element = null;
      this.modules = {};

      // Give this ViewModule instance a unique ID
      this._vid = _.uniqueId('viewModule_');
    },

    setViewModel: function(data) {
      this.viewModel = data;
      this.invalidateViewModel();
    },

    invalidateViewModel: function(){
      this._render();
    },

    setElement: function($element) {
      if (this.$element) {
        this.$element.off();
      }
      this.$element = $element;
    },

    _searchModules: function($searchElement, modules){
      var self = this;
      modules = modules || [];
      $searchElement.children().each(function(index, child){
        var $child = $(child);
        if ($child.attr('data-module')){
          modules.push($child);
        } else {
          self._searchModules($child, modules);
        }
      });
      return modules;
    },

    _render : function(){
      var self = this;
      if (!this.$element) {
        return;
      }

      this.$element.off();
      this.teardown();
      this.preRender();

      if (this.template && this.viewModel) {
        this.$element.html(Handlebars.templates[this.template](this.viewModel));
      } else if(!this.viewModel && this.template) {
        this.$element.empty();
      }

      var $moduleContainers = this._searchModules(this.$element);
      _.each($moduleContainers, function($moduleElement){
        var moduleClassName = $moduleElement.attr('data-module');
        var moduleId = $moduleElement.attr('data-id');
        var ModuleClass = ViewModuleUtils.getClassByName(moduleClassName);
        if (ModuleClass) {
          var module = null;
          if (_(self.modules).has(moduleId)){
            module = self.modules[moduleId];
          } else {
            module = new ModuleClass();
            self.modules[moduleId] = module;
          }
          module.setElement($moduleElement);
        } else {
          throw new Error('ViewModule class used in template but not defined: ' + moduleClassName);
        }
      });
      _.forEach(this.modules, function(module){
        module.setViewModel(this.viewModel);
      }, this);
      this.initSelectors();
      this.initEventListeners();
      this.postRender();
    },

    clearTemplate: function(){
      this.$element.empty();
      _.forEach(this.modules, function(module){
        module.clearTemplate();
      }, this);
    },

    preRender: function() {
      // no op
    },

    initSelectors: function () {
      if (typeof this.ui == 'undefined') {
        return;
      }

      // save original selectors
      if (!this._ui_selectors) {
        this._ui_selectors = this.ui;
      }
      this._ui_selectors = this._ui_selectors || _.result( this, 'ui' );
      this.ui = {};
      for (var name in this._ui_selectors) {
        this.ui[name] = this.$element.find(this._ui_selectors[name]);
      }
    },

    initEventListeners: function () {
      this.delegateEvents();
    },

    // removes auto-registered event listeners
    removeEventListeners: function () {
      this.undelegateEvents();
    },

    // Backbone-style event delegation
    delegateEvents: function(events) {
      if (!(events || (events = _.result(this, 'events')))) return this;
      this.undelegateEvents();

      for (var key in events) {
        var method = events[key];
        if (!_.isFunction(method)) method = this[events[key]];
        if (!method) continue;
        key = ViewModuleUtils.normalizeUIString(key, this._ui_selectors);
        var match = key.match(EVENT_SPLITTER_REGEX);
        this.delegate(match[1], match[2], _.bind(method, this));
      }
      return this;
    },

    delegate: function (eventName, selector, listener) {
      var $el = this.$element;
      var NS = '.' + EVENT_NS + this._vid;
      _.forEach(eventName.split(','), function (evt) {
        $el.on(evt + NS, selector, listener);
      });
    },

    undelegateEvents: function() {
      if (this.$element) {
        this.$element.off('.' + EVENT_NS + this._vid);
      }
      return this;
    },

    undelegate: function (eventName, selector, listener) {
      var $el = this.$element;
      var NS = '.' + EVENT_NS + this._vid;
      _.forEach(eventName.split(','), function (evt) {
        $el.off(evt + NS, selector, listener);
      });
    },

    postRender: function(){
      // no op
    },

    teardown: function() {
      this.removeEventListeners();
    }
  });


});


}catch(ex){
if(nike.error){
nike.error('An unhandled exception was thrown while executing nike.exp.pdp.base.ViewModule. Make sure to look for previous errors because this might have failed as a result of another script failing', ex, 'Stack:', ex.stack, 'Message:', ex.message);
}
}
try{
var nike = nike || {};
nike.namespace("nike.exp.pdp.base.MiniPdpShell");

nike.requireDependency("nike.exp.pdp.TemplateHelpers");
nike.requireDependency("nike.exp.global.Modal");
nike.requireDependency("nike.exp.pdp.base.ViewModule");


(function() {

  nike.exp.pdp.base.MiniPdpShell = nike.exp.pdp.base.ViewModule.extend({
    pdpType : 'mini',

    init: function() {
      this._super();
    }
  });

})();


}catch(ex){
if(nike.error){
nike.error('An unhandled exception was thrown while executing nike.exp.pdp.base.MiniPdpShell. Make sure to look for previous errors because this might have failed as a result of another script failing', ex, 'Stack:', ex.stack, 'Message:', ex.message);
}
}



try{
var nike = nike || {};
nike.namespace("nike.exp.pdp.base.PreloadedAltHeroImage");

nike.requireDependency("nike.exp.pdp.base.ViewModule");

(function() {

  nike.exp.pdp.base.PreloadedAltHeroImage = nike.exp.pdp.base.ViewModule.extend({

    init: function() {
      this._super();
    }

  });

})();


}catch(ex){
if(nike.error){
nike.error('An unhandled exception was thrown while executing nike.exp.pdp.base.PreloadedAltHeroImage. Make sure to look for previous errors because this might have failed as a result of another script failing', ex, 'Stack:', ex.stack, 'Message:', ex.message);
}
}


try{
var nike = nike || {};
nike.namespace("nike.exp.pdp.base.HeroImage");

nike.requireDependency("nike.exp.pdp.base.ViewModule");

(function() {

  nike.exp.pdp.base.HeroImage = nike.exp.pdp.base.ViewModule.extend({

    init: function() {
      this._super();
    }
  });

})();


}catch(ex){
if(nike.error){
nike.error('An unhandled exception was thrown while executing nike.exp.pdp.base.HeroImage. Make sure to look for previous errors because this might have failed as a result of another script failing', ex, 'Stack:', ex.stack, 'Message:', ex.message);
}
}

try{
var nike = nike || {};
nike.namespace('nike.exp.pdp.HoverZoom');

nike.requireDependency('nike.Event');
nike.requireDependency('jQuery.hoverIntent');
nike.requireDependency('lib.lodash');

//noinspection JSUnresolvedVariable
nike.exp.pdp.HoverZoom = Class.extend({
	/* Element holders */
	$hoverDiv: undefined,
	$heroImage: undefined,
	$imageHolderDiv: undefined,
	$zoomDisplay: undefined,
	$zoomDisplayContainer: undefined,
	$hoverDivContainer: undefined,
	$debugPanel: undefined,
	$img: undefined,
	isTablet: false,
  namespace: "HoverZoom",
  queue : [],

	/**
	 * This sets whether or not to show the debug element on the page
	 * @type Boolean
	 * @private
	 */
	debug: false,

	opts: {
		selectors: {
			heroImage: '.exp-pdp-hero-image.active',
			heroOverlay: '.exp-hover-zoom-hover-cover',
			zoomDisplayParent: '.exp-pdp-content-container',
			zoomDisplay: '.exp-pdp-hero-zoom-display',
			zoomImgContainer: '.exp-pdp-hero-zoom-image-holder',
			clickTouchDialog: '.exp-pdp-click-touch-to-zoom-dialog'
		},
    $offsetParent: $('body'),
		zoomDisplayFade: {
			to: '.3',
			from: '1'
		},
    isNikeId: false,
    isModule: false,
		/**
		 * Default Zoom Display Css
		 *
		 * @type Object
		 * @private
		 */
		zoomDiv: {
			css: {
				zIndex: '220',
				background: '#F5F5F5',
				display: 'none',
				overflow: 'hidden',
				position: 'absolute',
				top: '0',
				left: '0'
			}
		},
		imageParams: {
			bgcolor: 'FFFFFF',
			format: 'jpeg',
			quality: '90'
		},
		zoomLevel: 3
	},

	imageSetZoom: undefined,

	/**
	 * This is the info panel for the debug,
	 * it gets added to the body if debug == true
	 *
	 * @type String
	 * @constant
	 */
	DEFAULT_INFO_PANEL: '<div class="exp-pdp-hero-image-info-panel" style="position:absolute; top: 100px; left: 50px;">' +
			'<span style="font-weight: bold;">Current Image: </span>' +
			'<br><span>Offset: </span>' +
			'<br><span>left:</span><span class="hero-left"></span>' +
			'<br><span>top:</span><span class="hero-top"></span><br>' +
			'<span style="font-weight: bold;">Hover Div:</span>' +
			'<br><span>X: </span><span class="hover-x"></span>' +
			'<br><span>Y: </span><span class="hover-y"></span><br>' +
      '<span style="font-weight: bold;">Mouse Position:</span>' +
      '<br><span>pageX: </span><span class="mouse-page-x"></span>' +
      '<br><span>pageY: </span><span class="mouse-page-y"></span>' +
			'<br><span>height: </span><span class="hover-height"></span>' +
			'<br><span>width: </span><span class="hover-width"></span>' +
			'<br><span  style="font-weight: bold">Is In Bounds:</span><span class="hover-in-bounds"></span>' +
			'<br><span>XMin: </span><span class="x-min"></span>' +
			'<br><span>XMax: </span><span class ="x-max"></span>' +
			'<br><span>YMin: </span><span class="y-min"></span>' +
			'<br><span>YMax: </span><span class="y-max"></span><br>' +
			'<span style="font-weight: bold;">Zoomed Image</span><br><span>image-x: </span><span class="zoomed-x"></span><br>' +
			'<span>image-y: </span><span class="zoomed-y"></span><br>' +
			'<br><span>height: </span><span class="zoom-height"></span>' +
			'<br><span>width: </span><span class="zoom-width"></span>' +
			'<br><span>Last Mouse Event: </span><span class="mouse-event"></span>' +
			'<br><span>Image is loaded:</span><span class="image-loaded"></span><br><span>Zoom: </span><span class="zoom-level"></span>' +
			'</div>',

	/**
	 * This holds the boundaries for the image to contain the hover div
	 * @type Object
	 * @private
	 */
	imageBoundaries: {
		/**
		 * xMin (left) of the image
		 * @type Integer
		 * @private
		 */
		xMin: undefined,
		/**
		 * xMax (right) of the image
		 * @type Integer
		 * @private
		 */
		xMax: undefined,
		/**
		 * yMin (top) of the image
		 * @type Integer
		 * @private
		 */
		yMin: undefined,
		/**
		 * yMax (bottom) of the image
		 * @type Integer
		 * @private
		 */
		yMax: undefined
	},

	/**
	 * This is the holder of the currently zoomed image
	 * @type Object
	 * @private
	 */
	currentlyZoomedImage: undefined,

	/**
	 * Holds the image position, and is an object with top and left
	 * @type Object
	 * @private
	 */
	imgPosition: undefined,

	/**
	 * Holds image width for zoom level
	 * @type int
	 * @private
	 */
	imageWidth: 0,

	currentMousePosition: {
		pageX: 0,
		pageY: 0
	},

	/**
	 * A cached set of selectors to help determine whether or not to show the hover box
	 */
	$modalMasks: undefined,

	/**
	 * @constructor
	 * @param {object} options
	 * example of what options could look like:
	 * opts : {
   *   zoomDiv : {
   *     selector : 'exp-pdp-blah',
   *     css : {
   *       background : url('/swoosh.png/')
   *     }
   *   },
   *   hoverDiv : {
   *     selector : ' blah ',
   *     css : {
   *       cursor : 'crosshair'
   *     }
   *   }
   * }
	 */
	init: function (options) {

		this.setOptions(options);

		this.$heroImage = $(this.opts.selectors.heroImage);
		this.$heroImage.css('cursor', 'progress');
    this.setupDebugPanel();

		// capture the product title for later use with an analytics check
		this.productId = this.opts.productId || $('input[name="productId"]').val() || (nike.exp.pdp.PdpPage && nike.exp.pdp.PdpPage.currentProduct.productId);

		this.createHoverZoomMarkup();
		this.$zoomDisplay.css(this.opts.zoomDiv.css);
		this.setHoverDivDimensions();
		this.setImageBoundaries();
		this.setEvents();
		this.setListeners();
		this.toggleHoverDiv(false);
	},

  /**
   * Quick initial setup for the Debug Panel.
   * If the user is on the mini pdp, append the panel to the modal instead of the body tag.
   */
  setupDebugPanel: function(){
    if (this.debug) {
      $('.exp-pdp-hero-image-info-panel').remove();
      if(this.opts.$debugContainer && this.opts.$debugContainer.length > 0) {
        this.opts.$debugContainer.prepend(this.DEFAULT_INFO_PANEL);
        $('.modal-window-class.nsg-bg--white').css({width: '90%'});
      }
      else {
        $('body').append(this.DEFAULT_INFO_PANEL);
      }
      this.$debugPanel = $('.exp-pdp-hero-image-info-panel');
    }
  },

	changeZoomedImage: function () {
		//load Image
		this.loadZoomedImage(this.getImageZoomedImageUrl(this.$heroImage));
	},

	/**
	 * Creates any markup that needs to be created,
	 * also if we were sent in some selectors for where some items are wanted to be displayed
	 * then we use those, otherwise we use the defaults.
	 */
	createHoverZoomMarkup: function () {
		// Create the markup only once, if it already exists on the page reuse it.
		if (!this.$zoomDisplayContainer) {
			this.$zoomDisplayContainer = this.$heroImage.parent();
		}

		if (!this.$hoverDivContainer) {
			this.$hoverDivContainer = this.$heroImage.parent();
		}

		this.$imageHolderDiv = ($(this.opts.selectors.zoomImgContainer).length < 1)
				? $('<div class="' + this.opts.selectors.zoomImgContainer.replace('.', '') + ' is-hidden"></div>').appendTo(this.$heroImage.parent())
				: $(this.opts.selectors.zoomImgContainer);

		this.$zoomDisplay = ($(this.opts.selectors.zoomDisplay).length < 1)
				? $('<div class="' + this.opts.selectors.zoomDisplay.replace('.', '') + '"></div>').appendTo(this.$zoomDisplayContainer)
				: this.$zoomDisplayContainer.find(this.opts.selectors.zoomDisplay);

		this.$hoverDiv = ($(this.opts.selectors.heroOverlay).length < 1)
				? $('<div class="' + this.opts.selectors.heroOverlay.replace('.', '') + '"><span class="loading-gif"></span></div>').appendTo(this.$hoverDivContainer)
				: this.$hoverDivContainer.find(this.opts.selectors.heroOverlay);

		// Add styling
		this.$zoomDisplayContainer.css('position', 'relative');
    //Fix for EDF-27163 to disable select on zoom overlay.
    $(this.opts.selectors.heroOverlay)
      .attr('unselectable', 'on')
      .addClass('not-selectable')
      .on('selectstart', false);

	},

	/**
	 * We create the zoom based off the large image src
	 * @param {Object} image
	 * @return {String}
	 */
	getImageZoomedImageUrl: function (image) {
		var currentImageSrc, width, height, zoomedHeight, zoomedWidth, holder;

    // Create split on first occurance of '?'
    var splitimgsrc = image.data('src-large').split(/\?(.+)?/);
		var imagePath = splitimgsrc[0];
    var retainedParams = splitimgsrc[1];


    //Multiply it by the default zoom (this could be overwritten but for now I'll leave it only as default)
    zoomedHeight = image.height() * this.opts.zoomLevel;
    zoomedWidth = image.width() * this.opts.zoomLevel;

    //replace the params we know we need to replace(only the last ones) then add the rest
    var params = ['wid','hei','fmt','qlt'];
    for(var i = 0; i < params.length; i++){
      var param = params[i];
      var replaceReg = new RegExp(param + '=(\\w+)');
      var replaceVal = '';
      if(param === 'wid'){
        replaceVal = zoomedWidth;
      } else if(param === 'hei'){
        replaceVal = zoomedHeight;
      } else if(param === 'fmt'){
        replaceVal = this.opts.imageParams.format;
      } else if(param === 'qlt'){
        replaceVal = this.opts.imageParams.quality;
      } else {
        replaceVal = '$1';
      }
      if(retainedParams && retainedParams.indexOf(param) !== -1){

        retainedParams = retainedParams.replace(replaceReg, param + '=' + replaceVal);

      } else {
        //var separator = retainedParams ? '&' : '?';
        var separator = '&';
        if(!retainedParams){
          retainedParams = '';
          separator = '?';
        }
        retainedParams += separator + param + '=' + replaceVal;
      }
    }
    if(retainedParams.indexOf('?') === 0){
      currentImageSrc = imagePath + retainedParams;
    } else {
      currentImageSrc = imagePath + '?' + retainedParams;
    }


    if(this.opts.isNikeId){
      if(retainedParams.indexOf("wid") >= 0){
        var retainedSplit = retainedParams.split('&wid');
        retainedParams = retainedSplit[0];
      }
      currentImageSrc += '&' + retainedParams
    }else{
      currentImageSrc += '&bgc=' + this.opts.imageParams.bgcolor;
    }

    //store image width for later use (not really sure if this is in use any more)
    this.imageWidth = zoomedWidth;


		return currentImageSrc;
	},

  /**
   * Gets the page X and Y from the event object
   * @param event
   * @returns {{pageX , pageY}}
   */
  getPageXandPageYFromEvent: function (event) {
    var offsetLeft = 0;
    var offsetTop = 0;
    var position = {};

    //Tablet will have touches
    if (event.originalEvent.touches && event.originalEvent.touches[0]) {

      // hoverZooms in hero image modules (IC-PDP, Mini-PDP, etc) handle offsets
      // different from Inline thus touch events need to follow suit
      if (this.opts.isModule) {
        offsetLeft = this.opts.$offsetParent.offset().left;
        offsetTop = this.opts.$offsetParent.offset().top;
      }

      position.pageX = event.originalEvent.touches[0].pageX - offsetLeft;
      position.pageY = event.originalEvent.touches[0].pageY - offsetTop;

      //Touchend/touchcancel will have undefined pageX and pageY
    } else if (event.originalEvent.touches && !event.originalEvent.touches.length) {
      position.pageX = undefined;
      position.pageY = undefined;
    } else { //Desktop
      offsetLeft = this.opts.$offsetParent.offset().left;
      offsetTop = this.opts.$offsetParent.offset().top;

      position.pageX = event.pageX - offsetLeft;
      position.pageY = event.pageY - offsetTop;
    }

    return position;
  },

	/**
	 * Checks if the x and y are inside the borders of the image
	 * @param {int} x
	 * @param {int} y
	 * @returns {boolean}
	 */
	isInsideImageBoundaries: function (x, y) {
		return (x >= this.imageBoundaries.xMin && x <= this.imageBoundaries.xMax && y >= this.imageBoundaries.yMin && y <= this.imageBoundaries.yMax);
	},

	/**
	 * Checks if the image is already loaded and stored and if not
	 * we load the image into our holder, which is hidden to the client
	 * @param {string} zoomSrc
	 */
	loadZoomedImage: function (zoomSrc) {
		// reset stuff
		this.$img = undefined;
		this.disableZoom();
		this.$heroImage.css('cursor', 'progress');
		this.$heroImage.data('click', 0);

		// start loading image.
		$('<img src="' + zoomSrc + '" />').load(this.imageLoadComplete.bind(this));
    this.queue.push(zoomSrc);
	},

	/**
	 * Called when the zoomed image has completed loading.
	 * @param {Event} e   The image Load Event.
	 */
	imageLoadComplete: function (e) {
    // image has finished loading
    this.$img = $(e.currentTarget);

    var src = this.$img.attr('src');

    if(this.queue.lastIndexOf(src) === this.queue.length - 1 && this.queue.lastIndexOf(src) != -1 && this.queue.length > 0){

      // reset stuff
      this.$imageHolderDiv.empty();
      this.$zoomDisplay.empty();

      this.$imageHolderDiv.append(this.$img);
      this.$img.addClass('active');
      nike.dispatchEvent(nike.Event.ZOOMED_IMAGE_LOADED);

      //set div sizes
      this.setHoverDivDimensions();
      // reset boundaries
      this.setImageBoundaries();

      if (this.$heroImage.data('click')) {
        this.enableZoom();
      }

      if (this.$heroImage.data('hover')) {
        var hPos = this.determineHoverBounds(this.currentMousePosition);
        this.$heroImage.css('cursor', 'auto');
        this.toggleHoverDiv(true);

        // update the position of the frame
        if( this.isTablet ){
          this.$hoverDiv
            .css({ left: hPos.x, top: hPos.y })
            .removeClass('loading');
        }

        nike.log('image loaded and being hovered');
      }
    } else {
      this.queue = _.filter(this.queue, function(v, i, arr){
        if(arr[i] === src){
          return false;
        } else {
          return true;
        }
      });
    }
	},

	/**
	 * Handles Mouse Enter event
	 *
	 * @param event
	 */
	onEnter: function (event) {
		this.$heroImage.data('hover', 1);
		var position = this.getPageXandPageYFromEvent(event);
		this.setCurrentMousePosition(position);
		var isInImageBounds = this.isInsideImageBoundaries(position.pageX, position.pageY);
		//if tablet we need to show the hover div with a loader on click
		if (this.isTablet && !this.$img && isInImageBounds) {
			this.toggleHoverDiv(true);
			this.$hoverDiv.addClass("loading");

      this.setHoverDivDimensions();
      var hPos = this.determineHoverBounds(position);
      this.$hoverDiv.css({ left: hPos.x, top: hPos.y });
		}

		if (this.$img) {
      // Hack to remove HoverZoom while other element is open over it
      var a = document.getElementsByClassName('mini-cart')[0],
          b = a.style.display === "block",
          c = $('.tier1').hasClass('is-active');

			if (isInImageBounds && (!b && !c) ) {
				//show hover zoom div
				this.toggleHoverDiv(true);

				if (this.$heroImage.data('click')) {

					//show Zoomed image
					this.toggleZoomedView(true);

					//update the zoomed image
					this.updateZoomDisplay();
				} else if (this.isTablet) {
					this.onClick(event);
				}
			}
		} else {
			//lazy load the image
			this.changeZoomedImage();

		}

		if (this.debug && this.$debugPanel) {
			$(this.$debugPanel).find('.mouse-event').text('mouseEnter');
		}

    // solves context menu popping up on hero image for long-press
    if (this.isTablet && !this.$img) {
      return false;
    }
	},

	/**
	 * This returns data that allows the hover zoom square to ride the
	 * bounds of the hero image, and allow the users mouse to go to the
	 * edge of the hero image without the zoom image disappearing.
	 * @param {Event|Object} position - The MouseMove Event, or a transformed Object based on an original mouse Event.
	 * @return {Object}
	 */
	determineHoverBounds: function (position) {
		// keep the zoom square within the image bounds if the user's cursor is near the edges.
		var mouse = { x: position.pageX, y: position.pageY };
		var hDims = { w: this.$hoverDiv.outerWidth(), h: this.$hoverDiv.outerHeight() };
		var hPos = {};

		// determine the X bounds
		if ((mouse.x - this.imageBoundaries.xMin) < hDims.w / 2) {
			hPos.x = this.imageBoundaries.xMin;
		}
		else if (mouse.x > (this.imageBoundaries.xMax - hDims.w / 2)) {
			hPos.x = this.imageBoundaries.xMax - hDims.w;
		}
		else {
			hPos.x = mouse.x - (hDims.w / 2);
		}

		// determine the Y bounds
		if ((mouse.y - this.imageBoundaries.yMin) < hDims.h / 2) {
			hPos.y = this.imageBoundaries.yMin;
		}
		else if (mouse.y > (this.imageBoundaries.yMax - hDims.h / 2)) {
			hPos.y = this.imageBoundaries.yMax - hDims.h;
		}
		else {
			hPos.y = mouse.y - (hDims.h / 2);
		}

		return hPos;
	},

  /**
   * Checks if the modal is visible (or if the hero image is in a miniPDP modal)
   * @returns {Boolean}
   */
  determineModalState: function () {
    var isDisplayable;

    if (this.$modalMasks) {
      if (this.$heroImage.parents('.modal-mask-class').length || !this.$modalMasks.is(':visible')) {
        isDisplayable = true;
      }
    }
    return isDisplayable;
  },

	enableZoom: function () {
		this.toggleHoverDiv(true);
		this.toggleZoomedView(true);
	},

	disableZoom: function () {
    // for tablet this is needed to display the loading box while the image loads
    if( !this.isTablet || this.isTablet && this.$img ){
      this.toggleHoverDiv(false);
    }
		this.toggleZoomedView(false);
		this.$heroImage.css('cursor', 'auto');
	},

	/**
	 * Handle mouse movement
	 * @param event
	 */
	onMove: function (event) {
		//added prevent default to keep the page from scrolling on tablets
		if( Modernizr.touch ){
      event.preventDefault();
    }

		this.$heroImage.data('hover', 1);
		var position = this.getPageXandPageYFromEvent(event);
		this.setCurrentMousePosition(position);
		var hPos = this.determineHoverBounds(position);
		var isInImageBounds = this.isInsideImageBoundaries(position.pageX, position.pageY);
    var isHoverOverlayDisplayable;

		if (this.isTablet && this.$img) {
      this.$hoverDiv.removeClass("loading");
		}

		if (isInImageBounds && !$(".exp-pdp-social-buttons").is(":hover")) {
      isHoverOverlayDisplayable = this.determineModalState();

			// make sure there's an image AND that a modal isn't visible
      if (this.$img && (Modernizr.touch || isHoverOverlayDisplayable)){
				this.$heroImage.css('cursor', 'auto');
				this.$hoverDiv.css({ left: hPos.x, top: hPos.y });

				if (this.$heroImage.data('click')) {
					this.updateZoomDisplay();
				} else {
					this.onEnter(event);
				}
			} else {
				this.$heroImage.css('cursor', 'progress');
			}
		} else {
			if (!this.isTablet) {
				this.onLeave(event);
			}
		}

		//Debug logic
		if (this.debug && this.$debugPanel) {
			this.$debugPanel.find('.hover-x').text(this.$hoverDiv.css('left'));
			this.$debugPanel.find('.hover-y').text(this.$hoverDiv.css('top'));
      this.$debugPanel.find('.mouse-page-x').text(event.pageX - this.opts.$offsetParent.offset().left);
      this.$debugPanel.find('.mouse-page-y').text(event.pageY - this.opts.$offsetParent.offset().top);

			this.$debugPanel.find('.mouse-event').text('mousemove');
			if (isInImageBounds) {
				if (!this.$img) {
					this.$debugPanel.find('.image-loaded').text('false');
				}
        this.$debugPanel.find('.hover-in-bounds').text('true');
			} else {
				this.$debugPanel.find('.hover-in-bounds').text('false');
			}
		}
	},

	onLeave: function (event) {
		//added prevent default to keep the page from scrolling on tablets
		if( Modernizr.touch ){
      event.preventDefault();
    }

		this.$heroImage.data('hover', 0);

		this.$heroImage.data('click', 0);

		var position = this.getPageXandPageYFromEvent(event);

		var isInImageBounds = this.isInsideImageBoundaries(position.pageX, position.pageY);

		if (!isInImageBounds || this.isTablet || $(".exp-pdp-social-buttons").is(":hover")) {
			//hide hover zoom div
			this.toggleHoverDiv(false);
			//hide zoomed display
			this.toggleZoomedView(false);

			//reset image boundaries just in case
			this.setImageBoundaries();


			//Debug logic
			if (this.debug && this.$debugPanel) {
				$(this.$debugPanel).find('.mouse-event').text('mouseleave');
			}
		}
	},

	onClick: function (event) {

		event.preventDefault();

		var position = this.getPageXandPageYFromEvent(event);
    this.setCurrentMousePosition(position);

		var isInImageBounds = this.isInsideImageBoundaries(position.pageX, position.pageY);

		if (isInImageBounds && this.isTablet && !this.$heroImage.data('click') && !this.$img) {
			this.$heroImage.data('click', 1);
			this.toggleHoverDiv(true);
		} else if (this.isTablet && this.$heroImage.data('click')) {
			this.$heroImage.data('click', 0);
			this.toggleZoomedView(false);
		}


		if (!this.$heroImage.data('click') || this.isTablet) {
			this.$heroImage.data('click', 1);

			if (this.$img) {
				// only fire once per product group
				if (this.productId != nike.exp.pdp.HoverZoom.storedProductId) {
					nike.exp.pdp.HoverZoom.storedProductId = this.productId;
					//make the dispatchEvent call async as this call was causing an issue in Chrome for Android
					setTimeout(function () {
						nike.dispatchEvent(nike.Event.CLICK_TOUCH_TO_ZOOM);
					}, 0);
				}

				//show Zoomed image
				this.toggleZoomedView(true);

				//update the zoomed image
				this.updateZoomDisplay();

        // update the position of the frame
        if( this.isTablet ){
          var hPos = this.determineHoverBounds(position);
          this.$hoverDiv.css({ left: hPos.x, top: hPos.y });
        }
			}
		} else {
			this.$heroImage.data('click', 0);
			this.toggleZoomedView(false);
		}
	},

	resizeSetup: function () {
    this.imageBoundariesSet = false;
		//set div sizes
		this.setHoverDivDimensions();
		// reset boundaries
		this.setImageBoundaries();
	},

	setCurrentMousePosition: function (position) {
		this.currentMousePosition.pageX = position.pageX;
		this.currentMousePosition.pageY = position.pageY;
	},

	/**
	 * This sets the size of hover div, and the size of the zoom display
	 */
	setHoverDivDimensions: function () {
		if (this.$img) {
			this.zoomImgDims = { w: this.$img.get(0).naturalWidth, h: this.$img.get(0).naturalHeight }; // have to do this since it's parent is hidden

			this.heroImgDims = { w: this.$heroImage.width(), h: this.$heroImage.height() };
			this.scale = (this.heroImgDims.w / this.zoomImgDims.w);
			var containerDims = { w: this.$zoomDisplayContainer.width(), h: this.heroImgDims.h }; // make sure the height is the same as the hero image

			this.$hoverDiv.css({
				width: Math.round(containerDims.w * this.scale),
				height: Math.round(containerDims.h * this.scale)
			});
			this.$zoomDisplay.css({
				width: Math.round(containerDims.w),
				height: Math.round(containerDims.h)
			});

			if (this.debug && this.$debugPanel) {
				this.$debugPanel.find('.hover-height').text(containerDims.h * this.scale);
				this.$debugPanel.find('.hover-width').text(containerDims.w * this.scale);
				this.$debugPanel.find('.zoom-height').text(this.zoomImgDims.h);
				this.$debugPanel.find('.zoom-width').text(this.zoomImgDims.w);
				this.$debugPanel.find('.zoom-level').text(this.scale);
			}

    /**
     * As part of EDF-30035, setting a default w/h for tablet if the image isn't loaded.
     * This way we can display the loading graphic, and when the zoom image is loaded the
     * container will resize properly.
     */
		}else if( this.isTablet ){
      this.$hoverDiv.css({
        width: 100,
        height: 100
      });
    }
	},

  /**
   * Calls destroy and init methods.
   */
  reinit: function(opts) {
    this.destroy();
    this.init($.extend(true, this.opts, opts));
  },

  /**
   * Destroy method that will unbind all bound events and is useful when you need to load
   * zoom multiple times on a single page.
   */
  destroy: function() {
    //Remove Events
    this.$heroImage.unbind('contextmenu.'+ this.namespace);
    this.$heroImage.parent().off('touchstart.'+this.namespace, $.proxy(this.onEnter, this));
    this.$heroImage.parent().off('touchend.'+this.namespace+' touchcancel.'+this.namespace+' mouseup.'+this.namespace, $.proxy(this.onLeave, this));
    this.$heroImage.parent().off('touchmove.'+this.namespace, $.proxy(this.onMove, this));
    this.$hoverDiv.off('click.'+this.namespace, $.proxy(this.onClick, this));

    this.$modalMasks = undefined;
    $(document).off('mousemove.' + this.namespace);

    //Remove Event Listeners
    nike.unlisten(nike.Event.PAGE_LAYOUT, $.proxy(this.resizeSetup, this));
    nike.unlisten(nike.Event.HERO_IMAGE_LOADED, $.proxy(this.changeZoomedImage, this));
    nike.unlisten(nike.Event.ZOOMED_IMAGE_LOADED, $.proxy(this.zoomedImageHasLoaded, this));
  },

	/**
	 * Sets up the events for the hover zoom
	 */
	setEvents: function () {
		//setting device specific events
		if (Modernizr.touch) {
			// add new listeners
			this.isTablet = true;
			this.$heroImage.bind('contextmenu.'+this.namespace, function () {
				return false;
			});
			this.$heroImage.parent().on('touchstart.'+this.namespace, $.proxy(this.onEnter, this));
			this.$heroImage.parent().on('touchend.'+this.namespace+' touchcancel.'+this.namespace+' mouseup.'+this.namespace, $.proxy(this.onLeave, this));
			this.$heroImage.parent().on('touchmove.'+this.namespace, $.proxy(this.onMove, this));
		} else {
			// remove old listeners if they exist
			var e = $.data($(document).get(0), 'events').mousemove;
			if(e){
				for(var i=0; i<e.length; i++){
					if( e[0].namespace == this.namespace ){
						// if any other listeners are added that aren't bound to markup that gets re-rendered, unbind them here.
						$(document).off('mousemove.'+this.namespace, $.proxy(this.onMove, this));
						break;
					}
				}
			}

			// add new listeners
			this.$hoverDiv.on('click.'+this.namespace, $.proxy(this.onClick, this));
			this.$heroImage.parent().hoverIntent($.proxy(this.onEnter, this), $.proxy(this.onLeave, this));
			this.$modalMasks = $('.modal-mask-class');
			$(document).on('mousemove.'+this.namespace, $.proxy(this.onMove, this));
		}
	},

	/**
	 * Takes in the image element gets the position and sets it for use elsewhere,
	 * then we do calculations for the boundaries of the image
	 */
	setImageBoundaries: function () {
    if(!this.imageBoundariesSet){
      var imagePosition = this.$heroImage.position();
      this.imgPosition = imagePosition;

      if (this.debug && this.$debugPanel) {
        this.$debugPanel.find('.hero-left').text(imagePosition.left);
        this.$debugPanel.find('.hero-top').text(imagePosition.top);
      }
      if(imagePosition){
        //we need to also account for the hover div and since its centered we use half of the div
        this.imageBoundaries.xMin = imagePosition.left;
        this.imageBoundaries.xMax = (imagePosition.left + parseInt(this.$heroImage.width()) );
        this.imageBoundaries.yMin = imagePosition.top;
        this.imageBoundaries.yMax = (imagePosition.top + parseInt(this.$heroImage.height()) );
      }

      this.imageBoundariesSet = true;
      if (this.debug && this.$debugPanel) {
        this.$debugPanel.find('.x-max').text(this.imageBoundaries.xMax);
        this.$debugPanel.find('.x-min').text(this.imageBoundaries.xMin);
        this.$debugPanel.find('.y-max').text(this.imageBoundaries.yMax);
        this.$debugPanel.find('.y-min').text(this.imageBoundaries.yMin);
      }
    }
	},

	/**
	 * Here is where we overwrite some of the default properties
	 * @param {object} opts
	 */
	setOptions: function (opts) {
		this.opts = $.extend(true, this.opts, opts);
		if (this.opts.zoomDiv) {
			this.$zoomDisplayContainer = (this.opts.selectors.zoomDisplayParent) ? $(this.opts.selectors.zoomDisplayParent) : this.$heroImage.parent();
		}
	},

	setListeners: function () {
		//Set new listeners
		nike.listen(nike.Event.PAGE_LAYOUT, $.proxy(this.resizeSetup, this));
		// user has selected a new Alt Image
		nike.listen(nike.Event.HERO_IMAGE_LOADED, $.proxy(this.changeZoomedImage, this));
		// The zoomed image has loaded
		nike.listen(nike.Event.ZOOMED_IMAGE_LOADED, $.proxy(this.zoomedImageHasLoaded, this));
	},

	/**
	 * Toggles Hover Div
	 * @param {boolean} show determines whether or not to show the hover div
	 */
	toggleHoverDiv: function (show) {
		if (this.$hoverDiv) {
			this.$hoverDiv.toggle(show);
		}
	},

	/**
	 * Toggles whether or not to show the zoomed image
	 * @param {boolean} show
	 */
	toggleZoomedView: function (show) {
		//get the image that should be inside the zoomed display

		if (this.debug && this.$debugPanel) {
			this.$debugPanel.find('.image-loaded').text(this.$img && this.$img.length > 0);
		}

		if (show && this.$img && this.$heroImage.data('click')) {
      var zoomedImage = this.$imageHolderDiv.find('img').clone();
			this.$zoomDisplay.siblings().css('opacity', this.opts.zoomDisplayFade.to);
			this.$zoomDisplay.empty().append(zoomedImage).fadeIn("fast");
			this.currentlyZoomedImage = zoomedImage;
			this.$hoverDiv.addClass('zoomed');
      if(this.currentlyZoomedImage){
        nike.Util.addQaAttribute(this.currentlyZoomedImage, 'pdp.productinfo.zoomedimage');
      }
			this.currentlyZoomedImage.css('position', 'absolute');
		} else {
			this.$zoomDisplay.siblings().css('opacity', this.opts.zoomDisplayFade.from);
			this.$zoomDisplay.fadeOut('fast');
			this.$hoverDiv.removeClass('zoomed');
		}
	},

	updateZoomDisplay: function () {
		var curPos = this.$hoverDiv.position();
		var imageElPos = this.$heroImage.position();
		var imgWidth = this.currentlyZoomedImage && this.currentlyZoomedImage.width() ? this.currentlyZoomedImage.width() : this.imageWidth;
		var leftPixel = (((curPos.left - imageElPos.left) / this.$heroImage.width()) * 100 * imgWidth) / 100;
		var topPixel = (((curPos.top - imageElPos.top) / this.$heroImage.height()) * 100 * imgWidth) / 100;

		if (this.currentlyZoomedImage) {
			this.currentlyZoomedImage.css({ left: '-' + leftPixel + 'px', top: '-' + topPixel + 'px'});
		} else {
			this.$zoomDisplay.find('img').css({ left: '-' + leftPixel + 'px', top: '-' + topPixel + 'px'});
		}

		if (this.debug && this.$debugPanel) {
			$(this.$debugPanel).find('.zoomed-x').text(this.currentlyZoomedImage.css('left'));
			$(this.$debugPanel).find('.zoomed-y').text(this.currentlyZoomedImage.css('top'));
		}
	},

	zoomedImageHasLoaded: function () {
		if (this.$heroImage.data('hover')) {
			this.toggleHoverDiv(true);
			this.toggleZoomedView(true);
		}
	}
});

}catch(ex){
if(nike.error){
nike.error('An unhandled exception was thrown while executing nike.exp.pdp.HoverZoom. Make sure to look for previous errors because this might have failed as a result of another script failing', ex, 'Stack:', ex.stack, 'Message:', ex.message);
}
}

try{
var nike = nike || {};
if(nike.namespace){nike.namespace('nike.exp.pdp.templates.desktop.HeroImageModule');}
   (function() { 
     var template = Handlebars.template, 
         templates = Handlebars.templates = Handlebars.templates || {}; 
     templates['HeroImageModule'] = template({"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3=container.escapeExpression, alias4=container.lambda;

  return "<div class=\"product-image\">\n    <div class=\"hero-image-container\">\n        <img class=\"exp-hero-image "
    + ((stack1 = helpers.unless.call(alias1,(data && data.index),{"name":"unless","hash":{},"fn":container.program(2, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\" data-index=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" data-productId=\""
    + alias3(alias4((depths[1] != null ? depths[1].productId : depths[1]), depth0))
    + "\"\n             src=\""
    + alias3((helpers.arrayLookup || (depth0 && depth0.arrayLookup) || alias2).call(alias1,(depths[1] != null ? depths[1].imagesHeroLarge : depths[1]),(data && data.index),{"name":"arrayLookup","hash":{},"data":data}))
    + "\"\n             data-src-large=\""
    + alias3((helpers.arrayLookup || (depth0 && depth0.arrayLookup) || alias2).call(alias1,(depths[1] != null ? depths[1].imagesHeroLarge : depths[1]),(data && data.index),{"name":"arrayLookup","hash":{},"data":data}))
    + "\"\n             data-src-medium=\""
    + alias3((helpers.arrayLookup || (depth0 && depth0.arrayLookup) || alias2).call(alias1,(depths[1] != null ? depths[1].imagesHeroMedium : depths[1]),(data && data.index),{"name":"arrayLookup","hash":{},"data":data}))
    + "\"\n             data-src-small=\""
    + alias3((helpers.arrayLookup || (depth0 && depth0.arrayLookup) || alias2).call(alias1,(depths[1] != null ? depths[1].imagesHeroSmall : depths[1]),(data && data.index),{"name":"arrayLookup","hash":{},"data":data}))
    + "\"\n             alt=\""
    + ((stack1 = alias4((depths[1] != null ? depths[1].displayName : depths[1]), depth0)) != null ? stack1 : "")
    + "\" "
    + alias3((helpers.buildQaAttr || (depth0 && depth0.buildQaAttr) || alias2).call(alias1,"minipdp.productinfo.image",{"name":"buildQaAttr","hash":{},"data":data}))
    + "/>\n    </div>\n</div>\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "active";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return alias3((helpers.requireDependency || (depth0 && depth0.requireDependency) || alias2).call(alias1,"nike.exp.global.TemplateHelpers",{"name":"requireDependency","hash":{},"data":data}))
    + "\n"
    + alias3((helpers.requireDependency || (depth0 && depth0.requireDependency) || alias2).call(alias1,"nike.exp.pdp.TemplateHelpers",{"name":"requireDependency","hash":{},"data":data}))
    + "\n\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.imagesThumbnail : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"useData":true,"useDepths":true}); 
   })();
}catch(ex){
if(nike.error){
nike.error('An unhandled exception was thrown while executing nike.exp.pdp.templates.desktop.HeroImageModule. Make sure to look for previous errors because this might have failed as a result of another script failing', ex, 'Stack:', ex.stack, 'Message:', ex.message);
}
}
try{
var nike = nike || {};
nike.namespace("nike.exp.pdp.desktop.HeroImage");
nike.requireDependency("nike.exp.pdp.base.HeroImage");
nike.requireDependency("nike.Util");
nike.requireDependency('nike.exp.pdp.HoverZoom');
nike.requireDependency('jQuery.url');

nike.requireDependency("nike.exp.pdp.templates.desktop.HeroImageModule");


(function() {

  nike.exp.pdp.desktop.HeroImage = nike.exp.pdp.base.HeroImage.extend({

    init: function() {
      this._super();
      this.template = "HeroImageModule";
      this.isTablet = false;
      this.hoverZoom = undefined;
      this.width = null;
      this.height = null;
      this.$activeHeroImage = null;


      nike.Util.windowResizeListen($.proxy(function(){
        if(nike.exp.pdp.desktop.imageHoverZoom) {
          nike.exp.pdp.desktop.imageHoverZoom.resizeSetup();
        }
      }, this));
    },

    initSelectors: function(){
      this.$activeHeroImage = this.$element.find('.exp-hero-image.active');
    },

    setViewModel: function(data) {
      if (data) {
        data.isTablet = this.isTablet;
      }
      this._super(data);
    },

    postRender: function(){
      this.$activeHeroImage.load($.proxy(this.initHoverZoom, this));
    },

    swapOutHeroImage : function(imageIndex){
      var $currentImage = this.$element.find('img.active');
      var $newImage = this.$element.find('img[data-index='+imageIndex+']');
      $currentImage.removeClass('active');
      $newImage.addClass('active');

      this.updateHoverZoom($newImage);
    },

    initHoverZoom: function(){
      if(!nike.exp.pdp.desktop.imageHoverZoom){
        nike.exp.pdp.desktop.imageHoverZoom = new nike.exp.pdp.HoverZoom({
          imageParams : {
            bgcolor : 'F5F5F5',
            format  : 'jpeg',
            quality : '85'
          },
          selectors: {
            heroImage: '.exp-hero-image.active',
            zoomDisplayParent: '.product-detail-container'
          },
          $offsetParent: $('.hero-image-module'),
          $debugContainer: $('.mini-pdp-container')
        });

      }
    },

    updateHoverZoom : function($newImage){
      nike.exp.pdp.desktop.imageHoverZoom.$heroImage = $newImage;
      nike.exp.pdp.desktop.imageHoverZoom.changeZoomedImage();
    },

    destroyHoverZoom: function(){
      nike.exp.pdp.desktop.imageHoverZoom = null;
    }

  });

})();

}catch(ex){
if(nike.error){
nike.error('An unhandled exception was thrown while executing nike.exp.pdp.desktop.HeroImage. Make sure to look for previous errors because this might have failed as a result of another script failing', ex, 'Stack:', ex.stack, 'Message:', ex.message);
}
}

try{
var nike = nike || {};

/*********************************************************************************************************************
** DEPRECATED: Please use Hammer.js for all future touch related functionality
*********************************************************************************************************************/

nike.namespace('nike.DragCarousel');


nike.DragCarousel = (function() {
    /**
        @class
            nike.DragCarousel is a simplified drag scrolling handler.
            Adapted from Drag.js

        @constructs nike.DragCarousel

        @param {DOM element|jQuery object} el DOM element on which touch events will be listened
        @param {Function} tapCallback function that should be called on a tap
    */
    function DragCarousel(el, tapCallback, updateDragFn, endDragFn) {
        var self = this;
        self.elem = $(el);
        self.tapCallback = tapCallback || function(){};
        self.updateDragFn = updateDragFn || function(){};
        self.endDragFn = endDragFn || function(){};


        // Threshold (in milliseconds) below which a touch event is considered a "tap" (click)
        self.tapDurThreshold = 200;

        // Threshold (in pixels) below which a touch event is considered a "tap" (click)
        self.tapDeltaThreshold = 5;

        // Horizontal/Vertical distance between the beginning of a swipe and it's current swipe position
        self.deltaX = self.deltaY = 0;

        self.elem.bind('touchstart', $.proxy(self.beginDrag, self));
        self.elem.bind('touchmove', $.proxy(self.continueDrag, self));
        self.elem.bind('touchend', $.proxy(self.endDrag, self));
    }

    /**
        Event handler for starting a drag on a DOM element. Sets various variables necessary to allow the drag to work correctly.
    */
    DragCarousel.prototype.beginDrag = function(event){
        var self = this;

        // Both pageX and pageY needed to drag correctly without using jQuery every frame
        self.touchStartX = event.originalEvent.touches[0].pageX;
        self.touchStartY = event.originalEvent.touches[0].pageY;

        // Start time so we can figure out how long the gesture took at the end of the drag
        self.touchStartTime = Date.now();
    };

    /**
        Event handler for persisting a drag. During the first run it will figure out whether this is a horizontal or vertical scroll.
    */
    DragCarousel.prototype.continueDrag = function(event){
        var self = this,
            deltaX = event.originalEvent.touches[0].pageX - self.touchStartX,
            deltaY = event.originalEvent.touches[0].pageY - self.touchStartY;

        // Prevent normal page scrolling
        event.preventDefault();

        self.deltaX = deltaX;
        self.deltaY = deltaY;

        this.updateDragFn.call(this, event);
    };

    /**
    *    Handler for the end of a drag event on the DOM element. Will determine what needs to be done as a result of the movement.
    *    If the touch start and end were in the same general vicinity, consider it a tap event.
    */
    DragCarousel.prototype.endDrag = function(event){
        var self = this,
            dragDur = Date.now() - self.touchStartTime;

        this.endDragFn.call(this, event);

        // If the touch
        if(dragDur < self.tapDurThreshold){
          self.tapCallback(event);
        }

        // Reset delta and touchStartTime for the next swipe event
        self.deltaX = self.deltaY = self.touchStartTime = 0;
    };

    return DragCarousel;

})();

}catch(ex){
if(nike.error){
nike.error('An unhandled exception was thrown while executing nike.DragCarousel. Make sure to look for previous errors because this might have failed as a result of another script failing', ex, 'Stack:', ex.stack, 'Message:', ex.message);
}
}

try{
var nike = nike || {};
nike.namespace("nike.exp.pdp.base.AltImages");

nike.requireDependency("nike.exp.pdp.base.ViewModule");

(function() {

  nike.exp.pdp.base.AltImages = nike.exp.pdp.base.ViewModule.extend({

    init: function() {
      this._super();
    }

  });

})();


}catch(ex){
if(nike.error){
nike.error('An unhandled exception was thrown while executing nike.exp.pdp.base.AltImages. Make sure to look for previous errors because this might have failed as a result of another script failing', ex, 'Stack:', ex.stack, 'Message:', ex.message);
}
}


try{
var nike = nike || {};
nike.namespace('nike.exp.pdp.ModuleHelpers');

nike.requireDependency('nike.exp.global.TemplateHelpers');
nike.requireDependency('HandlebarsRuntime');

!function(){

  var IMAGE_BG_MAP = { heroImage :'F5F5F5', altImage:'F5F5F5', notifyMe:'FFFFFF' };
  var IMAGE_BORDER_ARR = ["", "FFFFFF", "F9F7EA", "FFFCF4", "E5EAEE", "FFFOE3", "F7FBFA", "FAF8F4", "FAF8F0", "FFF8F7", "FFFBF4", "F7F7F7", "FFFAF5",  "EFF4F8"];
  var IMAGE_PARAMS = {
    altImage : {
      hei : 60,
      wid : 60,
      fmt : 'jpeg',
      bgc : 'F5F5F5'
    },
    colorWay : {
      hei : 61,
      wid : 61,
      fmt : 'jpeg',
      bgc : 'F5F5F5'
    },
    medHeroImg : {
      hei : 460,
      wid : 460,
      fmt : 'jpeg',
      bgc : 'F5F5F5'
    },
    smallHeroImg : {
      hei : 380,
      wid : 380,
      fmt : 'jpeg',
      bgc : 'F5F5F5'
    },
    largeHeroImg : {
      hei : 620,
      wid : 620,
      fmt : 'jpeg',
      bgc : 'F5F5F5'
    }
  }

  /**
   * Adds the height and width attributes that are passed in as params to the image URL
   * for the purposes of requesting the right size from scene7. Outputs the image as JPG.
   *
   * Usage example:
   * {{resizeImage imageUrl 300 200}}
   * Output:
   * http://imageUrl?fmt=jpg&qty=85&wid=300&hei=200
   *
   * Can take a parameter for the background color. The available parameter options for
   * the colorKey are defined in the IMAGE_BG_MAP object.
   */
  Handlebars.registerHelper("resizeImage", function(imageUrl, w, h, colorKey){
    var bgc = (IMAGE_BG_MAP[colorKey]) ? '&bgc='+IMAGE_BG_MAP[colorKey] : '';

    return imageUrl.split('?')[0] + "?fmt=jpg&qty=85&wid=" + w + "&hei=" + h + bgc;
  });


  /**
   * Checks the renderDataQA attribute. If set to true, inserts the data-qa attribute
   * for automation. Requires the attribute value to be passed in as dataQaValue parameter.
   *
   * Also allows passing in an index for cases where you are creating a series of objects.
   * Doing so will result in the index value + 1 in the output.
   *
   * Usage examples:
   * {{buildQaAttr "foo"}} would become: data-qa="foo"
   * {{buildQaAttr "foo_" @index}} where the current index=0 would become: data-qa="foo_1"
   */

  Handlebars.registerHelper("buildQaAttr", function(dataQaValue, index) {
    var attribute;
    var qaValue = dataQaValue;

    if (typeof index === "number") {
      qaValue += (index + 1);
    }

    if (nike.ENV_CONFIG && nike.ENV_CONFIG.renderDataQA == "true") {
      attribute = nike.DATA_QA + '="' + qaValue + '"';
    } else {
      attribute = "";
    }
    return new Handlebars.SafeString(attribute);
  });



  Handlebars.registerHelper("determineArrowClasses", function(altImages){
    var vertImageBreak = 7;
    var horizontalImageBreak = 5;
    var showVerticalArrows = altImages && altImages.length > vertImageBreak;
    var showHorizontalArrows = altImages && altImages.length > horizontalImageBreak;
    var arrowClasses = showVerticalArrows ? ' show-vert-arrows ' : ' ';
    arrowClasses += showHorizontalArrows ? ' show-horiz-arrows ' : ' ';

    return arrowClasses;
  });

  Handlebars.registerHelper("determineViewportClasses", function(altImages){
    var imageCount = (altImages && altImages.length) || 0;
    var viewportClasses = "";
    if(imageCount == 7){
      viewportClasses += " seven-images";
    } else if(imageCount == 5){
      viewportClasses += " five-images";
    } else if (imageCount <= 4){
      viewportClasses += " four-or-less-images";
    }

    return viewportClasses;
  });

  Handlebars.registerHelper("addArrows", function(altImages){
    var imageCount = (altImages && altImages.length) || 0;
    var altClass = "";
    if(imageCount >= 5 && imageCount <=7){
      altClass = "add-arrows-horz"
    }else if(imageCount > 7){
      altClass = "add-arrows-both"
    }

    return altClass;
  });

  Handlebars.registerHelper("getImageParams", function(typeString){
    var params = "?";
    var imageParamObj = IMAGE_PARAMS[typeString];
    var indexholder = 0;
    for(var param in imageParamObj) {
      if(indexholder != 0){
        params += '&';
      }
      params += param + "=" +imageParamObj[param];
      indexholder++;
    };
    return params;
  });



}();

}catch(ex){
if(nike.error){
nike.error('An unhandled exception was thrown while executing nike.exp.pdp.ModuleHelpers. Make sure to look for previous errors because this might have failed as a result of another script failing', ex, 'Stack:', ex.stack, 'Message:', ex.message);
}
}
try{
var nike = nike || {};
if(nike.namespace){nike.namespace('nike.exp.pdp.templates.desktop.AltImagesModule');}
   (function() { 
     var template = Handlebars.template, 
         templates = Handlebars.templates = Handlebars.templates || {}; 
     templates['AltImagesModule'] = template({"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3=container.escapeExpression, alias4=container.lambda;

  return "              <li class=\"alt-images-item "
    + alias3((helpers.generatePdpImageActiveClass || (depth0 && depth0.generatePdpImageActiveClass) || alias2).call(alias1,(data && data.index),{"name":"generatePdpImageActiveClass","hash":{},"data":data}))
    + "\" "
    + alias3((helpers.buildQaAttr || (depth0 && depth0.buildQaAttr) || alias2).call(alias1,"pdp.altimages.image",{"name":"buildQaAttr","hash":{},"data":data}))
    + ">\n                  <img class=\"alt-image\" alt=\""
    + alias3(alias4((depths[1] != null ? depths[1].displayName : depths[1]), depth0))
    + "\" src=\""
    + ((stack1 = alias4(depth0, depth0)) != null ? stack1 : "")
    + "\" data-index=\""
    + alias3(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"index","hash":{},"data":data}) : helper)))
    + "\"/>\n              </li>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return alias3((helpers.requireDependency || (depth0 && depth0.requireDependency) || alias2).call(alias1,"nike.exp.global.TemplateHelpers",{"name":"requireDependency","hash":{},"data":data}))
    + "\n"
    + alias3((helpers.requireDependency || (depth0 && depth0.requireDependency) || alias2).call(alias1,"nike.exp.pdp.TemplateHelpers",{"name":"requireDependency","hash":{},"data":data}))
    + "\n"
    + alias3((helpers.requireDependency || (depth0 && depth0.requireDependency) || alias2).call(alias1,"nike.exp.pdp.ModuleHelpers",{"name":"requireDependency","hash":{},"data":data}))
    + "\n\n<div class=\"alt-images-container "
    + alias3((helpers.addArrows || (depth0 && depth0.addArrows) || alias2).call(alias1,(depth0 != null ? depth0.imagesThumbnail : depth0),{"name":"addArrows","hash":{},"data":data}))
    + " js-alt-images-container "
    + alias3(((helper = (helper = helpers.altImagesOrientation || (depth0 != null ? depth0.altImagesOrientation : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"altImagesOrientation","hash":{},"data":data}) : helper)))
    + "\">\n    <div class=\"alt-images-arrow prev-arrow\" "
    + alias3((helpers.buildQaAttr || (depth0 && depth0.buildQaAttr) || alias2).call(alias1,"pdp.altimages.prevarrow",{"name":"buildQaAttr","hash":{},"data":data}))
    + ">\n        <a href=\"#\" class=\"up-arrow nsg-text--medium-grey\"><div class=\"nsg-glyph--chevron-up\"></div></a>\n        <a href=\"#\" class=\"left-arrow nsg-text--medium-grey\"><div class=\"nsg-glyph--chevron-left\"></div></a>\n    </div>\n    <div class=\"alt-images-viewport\">\n        <ul class=\"alt-images-carousel\" "
    + alias3((helpers.buildQaAttr || (depth0 && depth0.buildQaAttr) || alias2).call(alias1,"pdp.altimages.imageCarousel",{"name":"buildQaAttr","hash":{},"data":data}))
    + ">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.imagesThumbnail : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        </ul>\n    </div>\n    <div class=\"alt-images-arrow next-arrow\" "
    + alias3((helpers.buildQaAttr || (depth0 && depth0.buildQaAttr) || alias2).call(alias1,"pdp.altimages.nextarrow",{"name":"buildQaAttr","hash":{},"data":data}))
    + ">\n        <a href=\"#\" class=\"down-arrow nsg-text--medium-grey\"><div class=\"nsg-glyph--chevron-down\"></div></a>\n        <a href=\"#\" class=\"right-arrow nsg-text--medium-grey\"><div class=\"nsg-glyph--chevron-right\"></div></a>\n    </div>\n</div>\n";
},"useData":true,"useDepths":true}); 
   })();
}catch(ex){
if(nike.error){
nike.error('An unhandled exception was thrown while executing nike.exp.pdp.templates.desktop.AltImagesModule. Make sure to look for previous errors because this might have failed as a result of another script failing', ex, 'Stack:', ex.stack, 'Message:', ex.message);
}
}
try{
var nike = nike || {};
nike.namespace("nike.exp.pdp.desktop.AltImages");

nike.requireDependency('jQuery.hoverIntent');
nike.requireDependency("nike.Event");
nike.requireDependency("nike.DragCarousel");
nike.requireDependency("nike.exp.pdp.base.AltImages");

nike.requireDependency("nike.exp.pdp.templates.desktop.AltImagesModule");

(function() {

  nike.exp.pdp.desktop.AltImages = nike.exp.pdp.base.AltImages.extend({

    events: {
      'click,touch .alt-images-arrow': 'handleArrowClick'
    },

    init: function() {
      this._super();
      this.template = "AltImagesModule";
      this.$altImages = null;
      this.$imgCarousel = null;
      this.$imgViewPort = null;
      this.$altImgArrows = null;
      this.draggablePosition = {};
      this.altImagedClicked = false;
    },

    setViewModel: function(data){
      _.defaults(data, {
        altImageOrientation: nike.exp.pdp.desktop.AltImages.VERTICAL
      });
      this._super(data);
    },

    initEventListeners : function(){

      // init 'events' shortcuts
      this._super();

      //alt-image events
      if (!Modernizr.touch){
        this.$altImages.hoverIntent({
          over: $.proxy(this.handleAltImageHover, this),
          out: $.noop,
          sensitivity: 15,
          interval: 25
        });

      } else {
        //alt-image touch
        this.$imgCarousel.find('img').on('click touch', this.$altImages, $.proxy(function (event) {
          this.handleAltImageHover(event);
        }, this));
      }

      this.$imgCarousel.parent().trigger({
        type : "altImagesLoaded"
      });
    },

    initSelectors : function(){
      this.$altImagesContainer = this.$element.find('.js-alt-images-container');
      this.$altImages = this.$element.find("li img");
      this.$imgCarousel = this.$element.find(".alt-images-carousel");
      this.$imgViewPort = this.$element.find(".alt-images-viewport");
      this.$altImgArrows = this.$element.find(".alt-images-arrow");

      this.altImageViewer(false, true);
    },

    handleAltImageHover : function(event){
      var $target = $(event.currentTarget);
      this.$element.trigger({
        type : nike.exp.pdp.desktop.AltImages.ALT_IMAGE_CHANGED,
        imageIndex : $target.data('index')
      });

      this.$element.trigger(nike.exp.pdp.desktop.AltImages.ALT_IMAGE_HOVER_CLICK);

      this.$imgCarousel.find('li.exp-pdp-active').removeClass('exp-pdp-active');
      $target.parent().addClass('exp-pdp-active');

      this.$altImages.removeClass("active");
      $target.addClass("active");

      if (!this.altImagedClicked) {
        this.altImagedClicked = true;

        nike.dispatchEvent(nike.Event.PDP_ALT_IMAGE_CLICKED, {});

      }
    },

    handleArrowClick : function(event){
      event.preventDefault();
      event.stopImmediatePropagation();
      var $target = $(event.currentTarget);
      var isNext = $target.hasClass('next-arrow');
      var isEnabled = $target.hasClass('enabled');
      if (isEnabled) {
        this.altImageViewer(isNext, false);
      }
    },

    altImageViewer : function (isNext, isPageLayoutChange) {
      var carousel = this.$imgCarousel;
      var viewPort = this.$imgViewPort;
      var disableButton = "none";
      var altImageHeightAndWidth = 0;
      var moveIncrement = 0;

      this.isVertical = carousel.parent().width() < carousel.height();

      if (this.isVertical) {
        altImageHeightAndWidth = Math.ceil(carousel.height()/this.$altImages.length);
        moveIncrement = viewPort.height();
      } else {
        altImageHeightAndWidth = Math.ceil(carousel.width()/this.$altImages.length);
        moveIncrement = viewPort.width();
      }

      /**
       *  moveTracker is the length in pixels that the carousel moves per increment
       *  totalMove is current displacement of the carousel plus/minus the moveTracker (depending on movement direction)
       *  maxMove is the maximum distance that that the carousel can move until the last image is visible in the viewport
       */
      var moveTracker, totalMove, maxMove;

      var animateOptions = {};

      if (!isPageLayoutChange) {

        moveTracker = isNext ? -moveIncrement : moveIncrement;

        if (this.isVertical) {
          animateOptions.top = isNext ? "-="+moveIncrement+"px" : "+="+moveIncrement+"px";
          //total height/width - viewport height/width
          maxMove = -(carousel.height() - viewPort.height());
          totalMove = Math.round((parseInt(carousel.css('top')) + moveTracker) / altImageHeightAndWidth) * altImageHeightAndWidth;
        } else {
          animateOptions.left = isNext ? "-="+moveIncrement+"px" : "+="+moveIncrement+"px";
          //total height/width - viewport height/width
          maxMove = -(carousel.width() - viewPort.width());
          totalMove = Math.round((parseInt(carousel.css('left')) + moveTracker) / altImageHeightAndWidth) * altImageHeightAndWidth;
        }

        //Limit totalMove to a number between 0 and maxMove (inclusive)
        totalMove = Math.min(Math.max(totalMove, maxMove), 0);

        if (this.isVertical) {
          animateOptions.top = totalMove;
          this.draggablePosition.top = totalMove;
        } else {
          animateOptions.left = totalMove;
          this.draggablePosition.left = totalMove;
        }

        //Determine button to disable
        if (totalMove <= maxMove) {
          disableButton = "next";
        } else if (totalMove >= 0) {
          disableButton = "prev";
        } else {
          disableButton = "none";
        }

        carousel.animate(animateOptions, 'fast');

      } else {
        carousel.css('left', 0);
        carousel.css('top', 0);
        disableButton = "prev";

        this.draggablePosition.top = this.draggablePosition.left = 0;
      }

      this.disableArrowButtons(disableButton);
    },


    disableArrowButtons : function (disableButton) {
      var prevArrow = this.$element.find('.prev-arrow');
      var nextArrow = this.$element.find('.next-arrow');

      if (disableButton === 'prev') {
        //Disables the "previous" button and enables the "next" button
        prevArrow.removeClass('enabled').addClass('disabled');
        nextArrow.removeClass('disabled').addClass('enabled');

      } else if (disableButton === 'next') {
        //Disables the "next" button and enables the "previous" button
        nextArrow.removeClass('enabled').addClass('disabled');
        prevArrow.removeClass('disabled').addClass('enabled');

      } else {
        //Enables both "previous" and "next" buttons
        nextArrow.removeClass('disabled').addClass('enabled');
        prevArrow.removeClass('disabled').addClass('enabled');
      }
    },

    // Options are 'horizontal' or 'vertical'
    setOrientation: function(orientation){
      if (this.viewModel) {
        this.$altImagesContainer.removeClass(nike.exp.pdp.desktop.AltImages.VERTICAL);
        this.$altImagesContainer.removeClass(nike.exp.pdp.desktop.AltImages.HORIZONTAL);
        this.viewModel.altImagesOrientation = orientation;
        this.$altImagesContainer.addClass(this.viewModel.altImagesOrientation);
        this.altImageViewer(false, true);
      }
    }

  });

  nike.exp.pdp.desktop.AltImages.VERTICAL = "vertical";
  nike.exp.pdp.desktop.AltImages.HORIZONTAL = "horizontal";
  nike.exp.pdp.desktop.AltImages.ALT_IMAGE_CHANGED = "nike.exp.pdp.desktop.AltImages:altImageChanged";
  nike.exp.pdp.desktop.AltImages.ALT_IMAGE_HOVER_CLICK ="nike.exp.pdp.desktop.AltImages:altImageHoverClick";

})();


}catch(ex){
if(nike.error){
nike.error('An unhandled exception was thrown while executing nike.exp.pdp.desktop.AltImages. Make sure to look for previous errors because this might have failed as a result of another script failing', ex, 'Stack:', ex.stack, 'Message:', ex.message);
}
}
try{
var nike = nike || {};
if(nike.namespace){nike.namespace('nike.exp.pdp.templates.desktop.PreloadedAltHeroImageModule');}
   (function() { 
     var template = Handlebars.template, 
         templates = Handlebars.templates = Handlebars.templates || {}; 
     templates['PreloadedAltHeroImageModule'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"preloaded-alt-hero-image-module "
    + container.escapeExpression(container.lambda((depth0 != null ? depth0.altImagesAvailable : depth0), depth0))
    + "\">\n  <div class=\"hero-image-module exp-module\" data-module=\"nike.exp.pdp.desktop.HeroImage\" data-id=\"heroImage\"></div>\n  <div class=\"alt-images-module exp-module\" data-module=\"nike.exp.pdp.desktop.AltImages\" data-id=\"altImages\"></div>\n  <span class=\"preloaded-image-container is-hidden\"></span>\n</div>\n";
},"useData":true}); 
   })();
}catch(ex){
if(nike.error){
nike.error('An unhandled exception was thrown while executing nike.exp.pdp.templates.desktop.PreloadedAltHeroImageModule. Make sure to look for previous errors because this might have failed as a result of another script failing', ex, 'Stack:', ex.stack, 'Message:', ex.message);
}
}
try{
var nike = nike || {};
nike.namespace("nike.exp.pdp.desktop.PreloadedAltHeroImage");

nike.requireDependency("nike.exp.pdp.base.PreloadedAltHeroImage");

nike.requireDependency("nike.exp.pdp.desktop.HeroImage");
nike.requireDependency("nike.exp.pdp.desktop.AltImages");
nike.requireDependency('nike.Util');
nike.requireDependency("nike.exp.pdp.templates.desktop.PreloadedAltHeroImageModule");

(function() {

  nike.exp.pdp.desktop.PreloadedAltHeroImage = nike.exp.pdp.base.PreloadedAltHeroImage.extend({

    init: function() {
      this._super();
      this.template = "PreloadedAltHeroImageModule";
    },

   initEventListeners : function(){
     this.$element.on(nike.exp.pdp.desktop.AltImages.ALT_IMAGE_CHANGED , $.proxy(function(event){
        this.changeHeroImage(event.imageIndex);
      }, this));

    },

    changeHeroImage : function(imageIndex){
      this.modules.heroImage.swapOutHeroImage(imageIndex);
    },

    setOrientation: function(orientation){
      this.modules.altImages.setOrientation(orientation);
    },

    destroyHoverZoom : function(){
      this.modules.heroImage.destroyHoverZoom();
    }

  });

  /*
    Constants to be used for when determining whether or not to show or hide alt images.
    These are CSS classes that are being used inside of MiniPdpShell.scss
  */
  nike.exp.pdp.desktop.PreloadedAltHeroImage.ALT_IMAGES_TRUE = "show-alt-images";
  nike.exp.pdp.desktop.PreloadedAltHeroImage.ALT_IMAGES_FALSE = "hide-alt-images";

})();


}catch(ex){
if(nike.error){
nike.error('An unhandled exception was thrown while executing nike.exp.pdp.desktop.PreloadedAltHeroImage. Make sure to look for previous errors because this might have failed as a result of another script failing', ex, 'Stack:', ex.stack, 'Message:', ex.message);
}
}


try{
var nike = nike || {};
nike.namespace("nike.exp.pdp.base.ProductTitle");

nike.requireDependency("nike.exp.pdp.base.ViewModule");

(function() {

  nike.exp.pdp.base.ProductTitle = nike.exp.pdp.base.ViewModule.extend({

    init: function() {
      this._super();
    }

  });

})();


}catch(ex){
if(nike.error){
nike.error('An unhandled exception was thrown while executing nike.exp.pdp.base.ProductTitle. Make sure to look for previous errors because this might have failed as a result of another script failing', ex, 'Stack:', ex.stack, 'Message:', ex.message);
}
}

try{
var nike = nike || {};
if(nike.namespace){nike.namespace('nike.exp.pdp.templates.desktop.ProductTitleModule');}
   (function() { 
     var template = Handlebars.template, 
         templates = Handlebars.templates = Handlebars.templates || {}; 
     templates['ProductTitleModule'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3=container.escapeExpression, alias4="function";

  return "      <h1 class=\"exp-product-title nsg-font-family--platform\" "
    + alias3((helpers.buildQaAttr || (depth0 && depth0.buildQaAttr) || alias2).call(alias1,"pdp.productinfo.product-title",{"name":"buildQaAttr","hash":{},"data":data}))
    + " itemprop=\"name\">"
    + ((stack1 = ((helper = (helper = helpers.productTitle || (depth0 != null ? depth0.productTitle : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"productTitle","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</h1>\n      <h2 class=\"exp-product-subtitle nsg-font-family--platform\" "
    + alias3((helpers.buildQaAttr || (depth0 && depth0.buildQaAttr) || alias2).call(alias1,"pdp.productinfo.product-subtitle",{"name":"buildQaAttr","hash":{},"data":data}))
    + ">"
    + ((stack1 = ((helper = (helper = helpers.productSubTitle || (depth0 != null ? depth0.productSubTitle : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"productSubTitle","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</h2>\n";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing;

  return "      <h1 class=\"exp-product-title nsg-font-family--platform\" "
    + container.escapeExpression((helpers.buildQaAttr || (depth0 && depth0.buildQaAttr) || alias2).call(alias1,"pdp.productinfo.product-title",{"name":"buildQaAttr","hash":{},"data":data}))
    + " itemprop=\"name\">"
    + ((stack1 = ((helper = (helper = helpers.displayName || (depth0 != null ? depth0.displayName : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"displayName","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</h1>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return container.escapeExpression((helpers.requireDependency || (depth0 && depth0.requireDependency) || helpers.helperMissing).call(alias1,"nike.exp.global.TemplateHelpers",{"name":"requireDependency","hash":{},"data":data}))
    + "\n\n<div class=\"product-title-module exp-product-header\">\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.productSubTitle : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "</div>\n";
},"useData":true}); 
   })();
}catch(ex){
if(nike.error){
nike.error('An unhandled exception was thrown while executing nike.exp.pdp.templates.desktop.ProductTitleModule. Make sure to look for previous errors because this might have failed as a result of another script failing', ex, 'Stack:', ex.stack, 'Message:', ex.message);
}
}
try{
var nike = nike || {};
nike.namespace("nike.exp.pdp.desktop.ProductTitle");

nike.requireDependency("nike.exp.pdp.base.ProductTitle");

nike.requireDependency('HandlebarsRuntime');
nike.requireDependency("nike.exp.pdp.templates.desktop.ProductTitleModule");

(function() {

  nike.exp.pdp.desktop.ProductTitle = nike.exp.pdp.base.ProductTitle.extend({

    init: function() {
      this._super();
      this.template = "ProductTitleModule";
    }
  });

})();


}catch(ex){
if(nike.error){
nike.error('An unhandled exception was thrown while executing nike.exp.pdp.desktop.ProductTitle. Make sure to look for previous errors because this might have failed as a result of another script failing', ex, 'Stack:', ex.stack, 'Message:', ex.message);
}
}


try{
var nike = nike || {};
nike.namespace("nike.exp.pdp.base.ProductPrice");

nike.requireDependency("nike.exp.pdp.base.ViewModule");

(function() {

  nike.exp.pdp.base.ProductPrice = nike.exp.pdp.base.ViewModule.extend({

    init: function() {
      this._super();
    }

  });

})();


}catch(ex){
if(nike.error){
nike.error('An unhandled exception was thrown while executing nike.exp.pdp.base.ProductPrice. Make sure to look for previous errors because this might have failed as a result of another script failing', ex, 'Stack:', ex.stack, 'Message:', ex.message);
}
}

try{
var nike = nike || {};
if(nike.namespace){nike.namespace('nike.exp.pdp.templates.desktop.ProductPriceModule');}
   (function() { 
     var template = Handlebars.template, 
         templates = Handlebars.templates = Handlebars.templates || {}; 
     templates['ProductPriceModule'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "  <div class=\"product-price-module product-info nsg-font-family--platform\">\n"
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.localPrice : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "  </div>\n";
},"2":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.setupPricing || (depth0 && depth0.setupPricing) || helpers.helperMissing).call(depth0 != null ? depth0 : {},"product-price-container",depth0,true,{"name":"setupPricing","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "        <div class=\"product-price nsg-text--dark-grey"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.onSale : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.employeeDiscountAvailable : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\" "
    + alias3((helpers.buildQaAttr || (depth0 && depth0.buildQaAttr) || alias2).call(alias1,"pdp.productinfo.price",{"name":"buildQaAttr","hash":{},"data":data}))
    + " itemtype=\""
    + alias3((helpers.getLocal || (depth0 && depth0.getLocal) || alias2).call(alias1,"pdp.microdata.price",{"name":"getLocal","hash":{},"data":data}))
    + "\" itemprop=\"offers\" itemscope=\"\">\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.overriddenLocalPrice : depth0),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "            <span class=\"local-price"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.discounted : depth0),{"name":"if","hash":{},"fn":container.program(10, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\" itemprop=\"price\">"
    + ((stack1 = ((helper = (helper = helpers.localPrice || (depth0 != null ? depth0.localPrice : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"localPrice","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</span>\n        </div>\n";
},"4":function(container,depth0,helpers,partials,data) {
    return " product-on-sale";
},"6":function(container,depth0,helpers,partials,data) {
    return " product-swoosh-price-available";
},"8":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return "              <span class=\"overridden-local-price\">"
    + ((stack1 = ((helper = (helper = helpers.overriddenLocalPrice || (depth0 != null ? depth0.overriddenLocalPrice : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"overriddenLocalPrice","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</span>\n";
},"10":function(container,depth0,helpers,partials,data) {
    return " nsg-text--nike-orange";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return alias3((helpers.requireDependency || (depth0 && depth0.requireDependency) || alias2).call(alias1,"nike.exp.global.TemplateHelpers",{"name":"requireDependency","hash":{},"data":data}))
    + "\n"
    + alias3((helpers.requireDependency || (depth0 && depth0.requireDependency) || alias2).call(alias1,"nike.exp.pdp.TemplateHelpers",{"name":"requireDependency","hash":{},"data":data}))
    + "\n"
    + alias3((helpers.requireDependency || (depth0 && depth0.requireDependency) || alias2).call(alias1,"nike.exp.global.templatehelpers.PricingHelpers",{"name":"requireDependency","hash":{},"data":data}))
    + "\n\n"
    + ((stack1 = (helpers.featureFlag || (depth0 && depth0.featureFlag) || alias2).call(alias1,"PRICING_PDP",{"name":"featureFlag","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"useData":true}); 
   })();
}catch(ex){
if(nike.error){
nike.error('An unhandled exception was thrown while executing nike.exp.pdp.templates.desktop.ProductPriceModule. Make sure to look for previous errors because this might have failed as a result of another script failing', ex, 'Stack:', ex.stack, 'Message:', ex.message);
}
}
try{
var nike = nike || {};
nike.namespace("nike.exp.pdp.desktop.ProductPrice");

nike.requireDependency("nike.exp.pdp.base.ProductPrice");

nike.requireDependency('HandlebarsRuntime');
nike.requireDependency("nike.exp.pdp.templates.desktop.ProductPriceModule");

(function() {

  nike.exp.pdp.desktop.ProductPrice = nike.exp.pdp.base.ProductPrice.extend({

    init: function() {
      this._super();
      this.template = "ProductPriceModule";
    },

    initEventListeners : function(){
      this.checkSwooshPricing()
    },
    /**
     * On initial load of the page Swoosh pricing won't display since we need to check the user type.
     * This method will build out the pricing again now that we have access to the user type.
     */
    checkSwooshPricing : function(){
      var self = this;
      var $els = $('.product-swoosh-price-available');
      if($els.length){
        $els.each(function(){
          var $el = $(this);
          var $newMarkup = $( Handlebars.templates[self.template]( self.viewModel ) );
          $el.hide();
          $el.replaceWith( $newMarkup );
        });
      }
    }
  });

})();


}catch(ex){
if(nike.error){
nike.error('An unhandled exception was thrown while executing nike.exp.pdp.desktop.ProductPrice. Make sure to look for previous errors because this might have failed as a result of another script failing', ex, 'Stack:', ex.stack, 'Message:', ex.message);
}
}


try{
var nike = nike || {};
nike.namespace("nike.exp.pdp.base.Colorways");

nike.requireDependency("nike.exp.pdp.base.ViewModule");

(function() {

  nike.exp.pdp.base.Colorways = nike.exp.pdp.base.ViewModule.extend({

    init: function() {
      this._super();
    }

  });

})();


}catch(ex){
if(nike.error){
nike.error('An unhandled exception was thrown while executing nike.exp.pdp.base.Colorways. Make sure to look for previous errors because this might have failed as a result of another script failing', ex, 'Stack:', ex.stack, 'Message:', ex.message);
}
}

try{
var nike = nike || {};
if(nike.namespace){nike.namespace('nike.exp.pdp.templates.desktop.ColorwaysModule');}
   (function() { 
     var template = Handlebars.template, 
         templates = Handlebars.templates = Handlebars.templates || {}; 
     templates['ColorwaysModule'] = template({"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "      <li class=\"exp-colorway color-chip "
    + alias4(((helper = (helper = helpers.stockType || (depth0 != null ? depth0.stockType : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"stockType","hash":{},"data":data}) : helper)))
    + " "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.selected : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\" data-product-id=\""
    + alias4(((helper = (helper = helpers.productId || (depth0 != null ? depth0.productId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"productId","hash":{},"data":data}) : helper)))
    + "\">\n        <a href=\""
    + alias4(container.lambda((depths[1] != null ? depths[1].url : depths[1]), depth0))
    + "\" title=\""
    + alias4(((helper = (helper = helpers.colorDescription || (depth0 != null ? depth0.colorDescription : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"colorDescription","hash":{},"data":data}) : helper)))
    + "\" aria-label=\""
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.selected : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0, blockParams, depths),"inverse":container.program(6, data, 0, blockParams, depths),"data":data})) != null ? stack1 : "")
    + alias4(((helper = (helper = helpers.colorDescription || (depth0 != null ? depth0.colorDescription : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"colorDescription","hash":{},"data":data}) : helper)))
    + "\"><img src=\""
    + alias4((helpers.resizeImage || (depth0 && depth0.resizeImage) || alias2).call(alias1,(depth0 != null ? depth0.imageUrl : depth0),62,62,"altImage",{"name":"resizeImage","hash":{},"data":data}))
    + "\" alt=\""
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.selected : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0, blockParams, depths),"inverse":container.program(6, data, 0, blockParams, depths),"data":data})) != null ? stack1 : "")
    + alias4(((helper = (helper = helpers.colorDescription || (depth0 != null ? depth0.colorDescription : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"colorDescription","hash":{},"data":data}) : helper)))
    + "\" /></a>\n      </li>\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "selected";
},"4":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.getLocal || (depth0 && depth0.getLocal) || helpers.helperMissing).call(depth0 != null ? depth0 : {},"pdp.selected.colorWay.aria",{"name":"getLocal","hash":{},"data":data})) != null ? stack1 : "");
},"6":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.getLocal || (depth0 && depth0.getLocal) || helpers.helperMissing).call(depth0 != null ? depth0 : {},"pdp.colorWay.aria",{"name":"getLocal","hash":{},"data":data})) != null ? stack1 : "");
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return alias3((helpers.requireDependency || (depth0 && depth0.requireDependency) || alias2).call(alias1,"nike.exp.pdp.ModuleHelpers",{"name":"requireDependency","hash":{},"data":data}))
    + "\n\n<div class=\"colorways-module\">\n  <ul class=\"colorways-container "
    + alias3(((helper = (helper = helpers.colorwaysState || (depth0 != null ? depth0.colorwaysState : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"colorwaysState","hash":{},"data":data}) : helper)))
    + "\">\n    <!-- display order: in stock, pre-order, coming soon, out of stock -->\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.allColorways : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "      <li class=\"exp-colorway expand-caret nsg-glyph--chevron-down\"></li>\n      <li class=\"exp-colorway collapse-caret nsg-glyph--chevron-up\"></li>\n  </ul>\n</div>\n";
},"useData":true,"useDepths":true}); 
   })();
}catch(ex){
if(nike.error){
nike.error('An unhandled exception was thrown while executing nike.exp.pdp.templates.desktop.ColorwaysModule. Make sure to look for previous errors because this might have failed as a result of another script failing', ex, 'Stack:', ex.stack, 'Message:', ex.message);
}
}
try{
var nike = nike || {};
nike.namespace('nike.exp.pdp.desktop.MiniPdpColorways');

nike.requireDependency('nike.exp.pdp.base.Colorways');
nike.requireDependency('lib.lodash');
nike.requireDependency('HandlebarsRuntime');
nike.requireDependency('nike.exp.pdp.templates.desktop.ColorwaysModule');

(function() {

  var MiniPdpColorways = nike.exp.pdp.base.Colorways.extend({

    init: function() {
      this._super();
      this.template = 'ColorwaysModule';
    },

    ui: {
        colorways: 'li.exp-colorway.color-chip',
        colorwaysContainer: '.colorways-container'
    },

    events: {
      'click @ui.colorways': 'handleColorwayClick'
    },

    postRender: function () {
      this.ui.colorwaysContainer.toggleClass( 'mod-4', this.viewModel && this.viewModel.colorwaysLength % 4 === 0);
    },

    handleColorwayClick: function(event) {
      if(event.preventDefault) {
        event.preventDefault();
      }
      var $colorway = $(event.currentTarget);
      if(!$colorway.is('.selected')) {
        this.selectColorway( $colorway.attr('data-product-id') );
      }
    },

    selectColorway: _.throttle(function(product_id) {
      var selectedColorway = _.findWhere(this.viewModel.allColorways, {'productId': product_id});
      if (selectedColorway) {
        this.$element.trigger(nike.exp.pdp.desktop.MiniPdpColorways.EVENT_COLORWAY_SELECTED, {selectedColorway: selectedColorway});
      }
    }, 600)
  });

  MiniPdpColorways.EVENT_COLORWAY_SELECTED = 'nike.exp.pdp.desktop.Colorways:SELECTED';
  MiniPdpColorways.EVENT_COLORWAYS_RESIZED = 'colorwayResize';

  // export
  nike.exp.pdp.desktop.MiniPdpColorways = MiniPdpColorways;


})();


}catch(ex){
if(nike.error){
nike.error('An unhandled exception was thrown while executing nike.exp.pdp.desktop.MiniPdpColorways. Make sure to look for previous errors because this might have failed as a result of another script failing', ex, 'Stack:', ex.stack, 'Message:', ex.message);
}
}


try{
var nike = nike || {};
nike.namespace("nike.exp.pdp.base.PdpNotification");

nike.requireDependency("nike.exp.pdp.base.ViewModule");

(function() {

  nike.exp.pdp.base.PdpNotification = nike.exp.pdp.base.ViewModule.extend({

    init: function() {
      this._super();
    }

  });

})();

}catch(ex){
if(nike.error){
nike.error('An unhandled exception was thrown while executing nike.exp.pdp.base.PdpNotification. Make sure to look for previous errors because this might have failed as a result of another script failing', ex, 'Stack:', ex.stack, 'Message:', ex.message);
}
}


try{
var nike = nike || {};
if(nike.namespace){nike.namespace('nike.exp.pdp.templates.ProductMessagingExpand');}
   (function() { 
     var template = Handlebars.template, 
         templates = Handlebars.templates = Handlebars.templates || {}; 
     templates['ProductMessagingExpand'] = template({"1":function(container,depth0,helpers,partials,data) {
    var alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "  <div class=\"exp-product-message__btn-container\">\n    <button class=\"exp-product-message__btn is--more js-productMessageBtn\">"
    + alias3((helpers.getLocal || (depth0 && depth0.getLocal) || alias2).call(alias1,"pdp.text.more",{"name":"getLocal","hash":{},"data":data}))
    + "</button>\n    <button class=\"exp-product-message__btn is--less js-productMessageBtn\">"
    + alias3((helpers.getLocal || (depth0 && depth0.getLocal) || alias2).call(alias1,"pdp.text.less",{"name":"getLocal","hash":{},"data":data}))
    + "</button>\n  </div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing;

  return container.escapeExpression((helpers.requireDependency || (depth0 && depth0.requireDependency) || alias2).call(alias1,"nike.exp.global.TemplateHelpers",{"name":"requireDependency","hash":{},"data":data}))
    + "\n"
    + ((stack1 = (helpers.featureFlag || (depth0 && depth0.featureFlag) || alias2).call(alias1,"PRODUCT_MESSAGING_COLLAPSE",{"name":"featureFlag","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"useData":true}); 
   })();
}catch(ex){
if(nike.error){
nike.error('An unhandled exception was thrown while executing nike.exp.pdp.templates.ProductMessagingExpand. Make sure to look for previous errors because this might have failed as a result of another script failing', ex, 'Stack:', ex.stack, 'Message:', ex.message);
}
}

(function (Handlebars) { var templates = Handlebars.templates || {}; Handlebars.registerPartial("ProductMessagingExpand", templates.ProductMessagingExpand || function () { return ''; });})(Handlebars || { registerPartial : function () {}});
try{
var nike = nike || {};
if(nike.namespace){nike.namespace('nike.exp.pdp.templates.desktop.PdpNotificationModule');}
   (function() { 
     var template = Handlebars.template, 
         templates = Handlebars.templates = Handlebars.templates || {}; 
     templates['PdpNotificationModule'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return container.escapeExpression((helpers.requirePartial || (depth0 && depth0.requirePartial) || helpers.helperMissing).call(depth0 != null ? depth0 : {},"nike.exp.pdp.templates.ProductMessagingExpand",{"name":"requirePartial","hash":{},"data":data}))
    + "\n\n<div class=\"pdp-notification-container\">\n  <div class=\"exp-message-container exp-product-message js-productMessage\">\n    <div class=\"message\">\n\n    </div>\n"
    + ((stack1 = container.invokePartial(partials.ProductMessagingExpand,depth0,{"name":"ProductMessagingExpand","data":data,"indent":"    ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "  </div>\n</div>\n";
},"usePartial":true,"useData":true}); 
   })();
}catch(ex){
if(nike.error){
nike.error('An unhandled exception was thrown while executing nike.exp.pdp.templates.desktop.PdpNotificationModule. Make sure to look for previous errors because this might have failed as a result of another script failing', ex, 'Stack:', ex.stack, 'Message:', ex.message);
}
}

try{
var nike = nike || {};
nike.namespace("nike.exp.pdp.ProductMessagingExpand");
nike.requireDependency("nike.DomReady");

/**
 * nike.exp.pdp.ProductMessagingExpand sets up the interactive behavior
 * for the product messaging for PDPs such as expand and collapse
 *
 * @type {void|*|Class}
 */
nike.exp.pdp.ProductMessagingExpand = Class.extend({
  cssModifiers : {
    IS_COLLAPSED : 'is--collapsed',
    IS_EXPANDED : 'is--expanded'
  },

  selectors : {
    MESSAGE_CONTAINER : '.js-productMessage',
    BUTTON : '.js-productMessageBtn'
  },

  els : {},

  /**
   * Initialize the messaging behavior using a jQuery selector for the
   * message container.
   *
   * @param {jQuery} $el - container for messaging
   */
  init: function($el){
    if($el && $el.find(this.selectors.BUTTON).length) {
      this.els.$messageContainer = $el;
      this.setupProductMessagingExpand();
    }
  },

  setupProductMessagingExpand : function(){
    var self = this;

    if (this.els.$messageContainer.outerHeight() > 105) {
      this.els.$messageContainer.addClass(this.cssModifiers.IS_COLLAPSED);

      $(this.selectors.BUTTON)
        .off(nike.interactionType.click)
        .on(nike.interactionType.click, function(e){
          e.preventDefault();

          var $thisMessageContainer = $(this).parents(self.selectors.MESSAGE_CONTAINER),
              $thisParentContainer = $thisMessageContainer.parent();

          $thisMessageContainer.toggleClass(self.cssModifiers.IS_COLLAPSED).toggleClass(self.cssModifiers.IS_EXPANDED);

          if($thisMessageContainer.outerHeight() > $thisParentContainer.outerHeight()) {
            $thisParentContainer.css('overflow-y','scroll');
          } else {
            $thisParentContainer.css('overflow-y', '');
          }
        });
    }
  }
});

}catch(ex){
if(nike.error){
nike.error('An unhandled exception was thrown while executing nike.exp.pdp.ProductMessagingExpand. Make sure to look for previous errors because this might have failed as a result of another script failing', ex, 'Stack:', ex.stack, 'Message:', ex.message);
}
}
try{
var nike = nike || {};
nike.namespace("nike.exp.pdp.desktop.PdpNotification");

nike.requireDependency('nike.exp.global.LocalValueUtil');
nike.requireDependency("nike.exp.pdp.base.PdpNotification");
nike.requireDependency("nike.exp.pdp.templates.desktop.PdpNotificationModule");
nike.requireDependency('nike.exp.pdp.ProductMessagingExpand');

(function() {

  nike.exp.pdp.desktop.PdpNotification = nike.exp.pdp.base.PdpNotification.extend({

    init: function() {
      this._super();
      this.template = "PdpNotificationModule";
    },

    initSelectors: function() {
      this.$container = this.$element.find('.pdp-notification-container');
      this.$messageContainer = this.$element.find('.js-productMessage');
      this.$message = this.$element.find('.message');
    },

    addMessage: function(message) {
      if (message) {
        this.$message.empty();
        this.$message.append(message);
        this.showMessage();

        new nike.exp.pdp.ProductMessagingExpand(this.$messageContainer);
      }
    },

    showMessage: function() {
      this.$container.css({maxHeight: '0', display: 'block'});
      this.$container.animate({opacity: 1, maxHeight: '500px'}, 500);
    },

    hideMessage: function() {
      this.$container.animate({opacity: 0, maxHeight: '0'}, 300);
    },

    addCSSClassesToH2: function(message) {
      return message.replace(/<(h)2>/ig, '<$12 class="exp-title nsg-font-family--platform-i">');
    }

  });

})();

}catch(ex){
if(nike.error){
nike.error('An unhandled exception was thrown while executing nike.exp.pdp.desktop.PdpNotification. Make sure to look for previous errors because this might have failed as a result of another script failing', ex, 'Stack:', ex.stack, 'Message:', ex.message);
}
}


try{
var nike = nike || {};
nike.namespace("nike.exp.pdp.base.BuyingTools");

nike.requireDependency("nike.exp.pdp.base.ViewModule");
nike.requireDependency("nike.Cart");

(function() {

  nike.exp.pdp.base.BuyingTools = nike.exp.pdp.base.ViewModule.extend({

    init: function() {
      this._super();
    },

    setUpQtyLimit : function(data){
      // Limit quantity drop down to 6 if user is a Swoosh User
      var cookie = nike.Cart.getCartSummaryFromCookie();
      if (cookie && cookie.userType === nike.Cart.UserType.EMPLOYEE){
        data.quantityLimit = 6;
      }
    },

    /**
     * <p>Disables buyingTools functionality
     *
     * @param  {Boolean} toToggle - true to disable, false to enable
     * @throws {TypeError} if toToggle is not a boolean;
     */
    disableBuyingTools: function (toToggle) {
      if (!_.isBoolean(toToggle)) {
        throw new TypeError();
      }

      this.$element.find('.nsg-form--drop-down')
        .toggleClass('is-disabled', toToggle);

      this.disableAddToCartButton(toToggle);
    },

    /**
     * <p> Specifically disables the add to cart button
     *
     * @param {Boolean} toToggle - true to disable, false to enable
     */
    disableAddToCartButton : function(toToggle){
      this.$element.find('button')
        .toggleClass('is-disabled', toToggle)
        .prop('disabled', toToggle);
    }

  });

})();


}catch(ex){
if(nike.error){
nike.error('An unhandled exception was thrown while executing nike.exp.pdp.base.BuyingTools. Make sure to look for previous errors because this might have failed as a result of another script failing', ex, 'Stack:', ex.stack, 'Message:', ex.message);
}
}

try{
var nike = nike || {};
nike.namespace('nike.exp.pdp.PdpToolTip');

nike.requireDependency('jQuery');

//noinspection JSValidateJSDoc
/**
 * An extensible tooltip that allows the dev to overwrite any of the default
 * tooltip settings.
 * @param {Object} userSettings {
 *   classes <Object> : { The classes assigned to the markup of the tooltip
 *     tooltip <String> : 'className',
 *     tooltipText <String> : 'className',
 *     tooltipBranch <String> : 'className'
 *   },
 *   displayOn <String> : Where the tooltip is displayed in relation to it's parent. Possible placements: 'top', 'bottom', 'left', 'right'
 *   markup <String> : The markup used to build the tooltip.
 *   offset <Object> : Adjust the positioning of the tooltip along x and y axis
 *   parent <Object> : A jQuery Object reference of the element you want the tooltip to appear near.
 *   tipText <String> : The text used in the tooltip.
 *   qaAttr <String> : If defined, this attribute will be added to the tooltip.
 * }
 * @constructor var tT = new nike.exp.pdp.PdpToolTip({ parent:$('.selector-name'), tipText:'Helpful text' });
 */
nike.exp.pdp.PdpToolTip = function(userSettings){
  var tT = this;
  tT.config = {
    classes: {
      tooltip       : 'tooltip',
      tooltipText   : 'tooltip-text',
      tooltipBranch : 'tooltip-branch'
    },
    displayOn : 'top', // possible 'top', 'bottom', 'left', 'right'
    markup    : '<div class="tooltip"><div class="tooltip-text"></div><div class="tooltip-branch"></div></div>',
    offset    : { x:0, y:0 },
    parent    : undefined,
    tipText   : 'Tooltip Text',
    qaAttr    : undefined
  };

  tT.config = $.extend(true, tT.config, userSettings);
};

nike.exp.pdp.PdpToolTip.prototype = {
  /**
   * Adds the tooltip to the DOM
   * @usage var tT = new nike.exp.pdp.PdpToolTip({ parent:a_jQuery_Object }); tT.addToolTip():
   */
  addToolTip : function(){
    var tT = this;
    tT.removeToolTip(); // remove old tooltip if it exists
    tT.tooltip        = $(tT.config.markup).insertAfter(tT.config.parent);
    tT.tooltipText    = tT.tooltip.find('.tooltip-text');
    tT.tooltipBranch  = tT.tooltip.find('.tooltip-branch');
    // add classes
    tT.tooltip.attr('class', tT.config.classes.tooltip);
    tT.tooltipText.attr('class', tT.config.classes.tooltipText);
    tT.tooltipBranch.attr('class', tT.config.classes.tooltipBranch);
    // change default text
    tT.tooltipText.html(tT.config.tipText);

    // add QA attribute if defined
    if(tT.config.qaAttr){ tT.tooltip.attr('data-qa', tT.config.qaAttr); }

    // add placement class now since certain dimensions can't be calculated without it
    switch(tT.config.displayOn.toLowerCase()){
      case 'top' : tT.tooltipBranch.addClass('on-top'); break;
      case 'bottom' : tT.tooltipBranch.addClass('on-bottom'); break;
      case 'left' : tT.tooltipBranch.addClass('on-left'); break;
      case 'right' : tT.tooltipBranch.addClass('on-right'); break;
    }

    // position the tooltip
    var ttW = tT.tooltip.outerWidth();
    var ttH = tT.tooltip.outerHeight();
    var bW  = tT.tooltipBranch.outerWidth();
    var bH  = tT.tooltipBranch.outerHeight();
    var pW  = tT.config.parent.outerWidth();
    var pH  = tT.config.parent.outerHeight();
    switch(tT.config.displayOn.toLowerCase()){
      case 'top' :
        tT.tooltip.css({
          top : -(ttH+bH+tT.config.offset.y),
          left: (pW-ttW)/2 + tT.config.offset.x
        });
        break;
      case 'bottom' :
        tT.tooltip.css({
          top : pH+(bH+tT.config.offset.y),
          left: (pW-ttW)/2 + tT.config.offset.x
        });
        break;
      case 'left' :
        tT.tooltip.css({
          top : (pH-ttH)/2 + tT.config.offset.y,
          left: -(ttW+bW+tT.config.offset.x)
        });
        break;
      case 'right' :
        tT.tooltip.css({
          top : (pH-ttH)/2 + tT.config.offset.y,
          left: pW + (bW+tT.config.offset.x)
        });
        break;
    }
  },

  /**
   * Remove the tooltip from the DOM
   * @usage tT.removeToolTip();
   */
  removeToolTip : function (){
    var tT = this;
    // if a tooltip with the same selector already exists, remove it
    var el = tT.config.parent.parent().find('.'+tT.config.classes.tooltip);
    if(el.length > 0){ el.remove(); }
  }

};

}catch(ex){
if(nike.error){
nike.error('An unhandled exception was thrown while executing nike.exp.pdp.PdpToolTip. Make sure to look for previous errors because this might have failed as a result of another script failing', ex, 'Stack:', ex.stack, 'Message:', ex.message);
}
}


try{
var nike = nike || {};
nike.namespace('nike.exp.pdp.PdpTemplateHelpers');

// Do not add dependencies for nike.Cart, jQuery or nike.Events.
// These are used if present on the page, but are null checked before use and are not required for the server side render.

nike.requireDependency('HandlebarsRuntime');
nike.requireDependency('JSON');
nike.requireDependency('nike.exp.global.TemplateHelpers');
nike.requireDependency('nike.exp.global.templatehelpers.PricingHelpers');
nike.requireDependency('nike.exp.global.LocalValueUtil');
nike.requireDependency('nike.exp.global.ColorwayStatus');


!function(){
  /**
   * Maximum of color options to show in one row. If there are 12 or less color options,
   * show all color options and hide the caret to allow user to display more.
   * If there are 13 or more colors to choose from, then ONLY show 11 swatches and also display the
   * caret to allow user to show more.
   */
  if(!nike.exp.pdp.COLOR_OPTIONS_CONFIG){
    nike.exp.pdp.COLOR_OPTIONS_CONFIG = {
      displayOrder: [
        nike.exp.global.ColorwayStatus.IN_STOCK,
        nike.exp.global.ColorwayStatus.PREORDER_IN_STOCK,
        nike.exp.global.ColorwayStatus.COMING_SOON,
        nike.exp.global.ColorwayStatus.OUT_OF_STOCK
      ],
      SWACTHES:{
        maxPerRow: 10
      }
    };
    nike.exp.pdp.COLOR_OPTIONS_CONFIG[nike.exp.global.ColorwayStatus.IN_STOCK] = {
      maxPerRow:{
        smScreen: 8,
        lgScreen: 12
      },
      title: ""
    };
    nike.exp.pdp.COLOR_OPTIONS_CONFIG[nike.exp.global.ColorwayStatus.COMING_SOON] = {
      maxPerRow: {
        smScreen: 4,
        lgScreen: 6
      }
    };
    nike.exp.pdp.COLOR_OPTIONS_CONFIG[nike.exp.global.ColorwayStatus.PREORDER_IN_STOCK] = {
      maxPerRow: {
        smScreen: 4,
        lgScreen: 6
      }
    };
    nike.exp.pdp.COLOR_OPTIONS_CONFIG[nike.exp.global.ColorwayStatus.OUT_OF_STOCK] = {
      maxPerRow: {
        smScreen: 4,
        lgScreen: 6
      }
    }
  }
  var colorOptionsConfig = nike.exp.pdp.COLOR_OPTIONS_CONFIG;
//  var MAX_COLOR_OPTIONS_PER_ROW = 6;
//	var MAX_COLOR_OPTIONS_PER_ROW_SM_SCREEN = 4;
//	var MAX_SWATCHES_PER_ROW = 10;
  var MAX_RATING_SCORE = 5;
  var IMAGE_BG_MAP = { heroImage :'F5F5F5', altImage:'F5F5F5', notifyMe:'FFFFFF' };
  var IMAGE_BORDER_ARR = ["", "FFFFFF", "F9F7EA", "FFFCF4", "E5EAEE", "FFFOE3", "F7FBFA", "FAF8F4", "FAF8F0", "FFF8F7", "FFFBF4", "F7F7F7", "FFFAF5",  "EFF4F8"];
  var IMAGE_PARAMS = {
    altImage : {
      hei : 60,
      wid : 60,
      fmt : 'jpeg',
      bgc : 'F5F5F5'
    },
    colorWay : {
      hei : 61,
      wid : 61,
      fmt : 'jpeg',
      bgc : 'F5F5F5'
    },
    medHeroImg : {
      hei : 460,
      wid : 460,
      fmt : 'jpeg',
      bgc : 'F5F5F5'
    },
    smallHeroImg : {
      hei : 380,
      wid : 380,
      fmt : 'jpeg',
      bgc : 'F5F5F5'
    },
    largeHeroImg : {
      hei : 620,
      wid : 620,
      fmt : 'jpeg',
      bgc : 'F5F5F5'
    }
  };

	Handlebars.registerHelper('prepNotifyMe', function (data, markup) {
		data.thumbnailUrl = data.imagesThumbnail[0];
    if(data.skuContainer) {
		  data.notifiableSkus = (data.showComingSoonMessage)
				? data.skuContainer.productSkus
				: _.filter(data.skuContainer.productSkus, { inStock: false });
    }
		return markup.fn(data);
	});


  /**
   * Block helper used to build out the Width Selector
   * @param {Object} data - pdpData.widthSelectorData
   */
  Handlebars.registerHelper("constructWidthSelector", function(data, markup){
    data.widths = [
      {
        width 		: 'NARROW',
        groupId 	: data.narrowWidthProductGroupId,
        productId : data.narrowWidthMainColorwayProductId,
        label			: nike.exp.global.LocalValueUtil.getLocal('buyingtools.width.narrow')
      },
      {
        width 		: 'REGULAR',
        groupId 	: data.regularWidthProductGroupId,
        productId : data.regularWidthMainColorwayProductId,
        label			: nike.exp.global.LocalValueUtil.getLocal('buyingtools.width.regular')
      },
      {
        width 		: 'WIDE',
        groupId 	: data.wideWidthProductGroupId,
        productId : data.wideWidthMainColorwayProductId,
        label			: nike.exp.global.LocalValueUtil.getLocal('buyingtools.width.wide')
      },
      {
        width 		: 'EXTRAWIDE',
        groupId 	: data.extraWideWidthProductGroupId,
        productId : data.extraWideWidthMainColorwayProductId,
        label			: nike.exp.global.LocalValueUtil.getLocal('buyingtools.width.extraWide')
      }
    ];

    var reg = new RegExp('pid\\-\\d+\\/pgid\\-\\d+');
    var count = 0;

    for(var w=0; w<data.widths.length; w++){
      var curr = data.widths[w];
      if( curr.productId || (curr.width === data.width) ){
        // if the current width doesn't have a product id, it's the selected width
        if(!curr.productId){
          curr.productId = data.productId;
        }
        curr.groupId = (curr.groupId === data.productGroupId) ? '' : curr.groupId;
        curr.selectedClass = (curr.width === data.width) ? " selected" : "";
        curr.qaAttr = 'pdp.'+curr.width.toLowerCase()+'.width';
        curr.url = data.pdpUrl.replace(reg, 'pid-'+curr.productId+'/pgid-'+curr.groupId);
        count++;
      }
    }

    data.showSelector = !!(count > 1);

    return markup.fn(data);
  });

  /**
   * Returns the mark up for the buying tools template
   * @param {Object} btData - pdpData.buyingToolsData
   * @param {Object} nmData - pdpData.notifyMeData
   * @param {Object} pData - pdpData.pricingData
   */
  Handlebars.registerHelper("constructBuyingTools", function(btData, nmData, pData){

    nmData.notifiableSkus = findNotifiableColorways(btData);
    btData.atLeastOneProductOutOfStock = nmData.notifiableSkus.length > 0;
    btData.inventoryChecked = btData.hasInventory !== undefined && btData.hasInventory !== null;
    btData.showBuyingTools = (btData.inventoryChecked && btData.hasInventory && !btData.softLaunchAvailable) ? true : false;
    nmData.notifiableSkus = [];
    nmData.pricingData = pData;


    // build the markup
    var buyingToolsMarkup = Handlebars.partials._BuyingTools(btData);
    if(btData.accessCode && !btData.isUnlocked){
      buyingToolsMarkup += Handlebars.partials._AccessCodeModal(btData);
    }
    if(nmData.notifyMe){
      buyingToolsMarkup += Handlebars.partials._NotifyMeModal(nmData);
    }

    return new Handlebars.SafeString(buyingToolsMarkup);

  });

  /**
   * Block helper used to build the options for the NFL player selector
   * @param {Object} nflData - pdpData.nflData
   */
  Handlebars.registerHelper("buildPlayerOptions", function(nflPdpModel, optionMarkup){
    var optionsMarkup = '',
        data = {},
        currPlayer;

    for(var i = 0; i < nflPdpModel.playerSelector.length; i++) {
      currPlayer = nflPdpModel.playerSelector[i];
      data = {
        classes 		: (currPlayer.status != "IN_STOCK") ? 'not-in-stock' : '',
        selected 		: (currPlayer.playerName == nflPdpModel.playerName) ? ' selected=selected' : '',
        productId       : currPlayer.productId,
        productGroupId  : currPlayer.productGroupId,
        playerName      : currPlayer.playerName,
        url             : currPlayer.url
      };

      optionsMarkup += optionMarkup.fn(data);
    }
    return new Handlebars.SafeString(optionsMarkup);
  });


  /**
   * Get a property from the global nike.exp.dynamic.AppConfig
   */
  Handlebars.registerHelper("getAppConfigProperty", function(propName){
    var ret;
    if(nike &&
       nike.objectDefined &&
       nike.objectDefined('nike.exp.dynamic.AppConfig') &&
       nike.exp.dynamic.AppConfig[propName] !== undefined){

      ret = nike.exp.dynamic.AppConfig[propName];
    }
    return ret;
  });

  /**
   * Type to hold info about a colorway section
   * @typedef {object} ColorwayHeightInfo
   * @property {number} expandedHeight
   * @property {number} collapsedHeight
   */

  /** EDF-16256
   * Returns the mark up for the colorways template.
   * If there are 12 (10 if product type is Apparel) or less total color options, show all of them in a row.
   * EDF-16467
   * show different groups of color variants (inStock, ComingSoon, PreOrder, OutOfStock)
   *
   * @param {object} pdpData
   * @param {object} [pageData]
   * @param {boolean} [pageData.isSmallScreen=false]
   * @param {object} [pageData.colorwayHeightInfoMap] Map of current expanded and collapsed heights of colorway sections indexed by colorwayStatus
   *   property - {ColorwayHeightInfo}
   *
   */
  Handlebars.registerHelper("buildColorOptions", function(pdpData, pageData){
    var colorwaysMarkup = "",
    colorwayContext,
    isNFL = pdpData.nflJersey,
    currentColorwayList,
    colorwayLists,
    isSmallScreen = false, //Indicates if we should be using maxItems settings for small screens
    colorwayHeightInfoList; //List to indicate the collapsed and expanded heights for each colorway section

    if(pageData){
      isSmallScreen = pageData.isSmallScreen;
      colorwayHeightInfoList = pageData.colorwayHeightInfoList;
    }

    //Separate colorways into lists by colorwayStatus
    colorwayLists = pdpData.colorOptionsData;

    //Build colorway section markup in a pre-defined order for each colorway list.
    var listOrder = nike.exp.pdp.COLOR_OPTIONS_CONFIG.displayOrder;
    for(var listName in listOrder){
      var cwStatus = listOrder[listName];
      if(listOrder.hasOwnProperty(listName) && colorwayLists[cwStatus]){
        currentColorwayList = colorwayLists[cwStatus];
        if(currentColorwayList.length > 0){

          //Build context for this colorway list
          colorwayContext = buildContextForColorway({
            colorwayList : currentColorwayList,
            colorwayStatus : cwStatus,
            selectedProductId : pdpData.productId,
            isSmallScreen : isSmallScreen,
            colorwayHeightInfo : colorwayHeightInfoList ? colorwayHeightInfoList[cwStatus] : undefined,
            nikeIdMatch : pdpData.nikeIdMatch,
            nikeIdBuilderUrl : pdpData.nikeIdBuilderUrl,
            customColorwayGeneralMessage : pdpData.customColorwayGeneralMessage,
            customMessages : pdpData.customColorwayStatusMessages,
            preOrderMessageWithDate : pdpData.preOrderMessageWithDate,
            notifyMe: pdpData.notifyMe && findNotifiableColorways(pdpData).length > 0,
            pageData: pageData,
            hideColorWays: pdpData.hideColorWays
          });

          colorwaysMarkup += Handlebars.templates._ColorWays(colorwayContext);
        }
      }
    }

    return new Handlebars.SafeString(colorwaysMarkup);


    //private functions
    /*********************
     * Build colorway context for a single colorway object
     *
     * @param {object} config This is all the options
     * @param {Array(object)} config.colorwayList colorwayList
     * @param {string} config.colorwayStatus
     * @param {string} config.selectedProductId
     * @param {boolean}config.isSmallScreen
     * @param {ColorwayHeightInfo} [config.colorwayHeightInfo]
     * @param {boolean} [config.nikeIdMatch=false]
     * @param {string} [config.nikeIdBuilderUrl]
     * @param {string} [config.customColorwayGeneralMessage]
     * @param {Array(string)} [config.customMessages]
     *
     *
     */
    function buildContextForColorway(config){
      var isPageLoad = true;
      if(pageData){
        isPageLoad = false;
      }

      var customColorwayGeneralMessage,
      customMessage,
      title,
      maxItemsPerRow, //the max number of colorways to show per row
      maxItemsPerRowSmallScreen, //the max number of colorways to show per row on small screens
      isMultiRow, //Should multiple rows be shown
      inStock = config.colorwayStatus == nike.exp.global.ColorwayStatus.IN_STOCK,
      i, L, currentColorway, //Iterator and temp var for colorway loop
      isSelectedColorwayList = false, // flag the colorway group that contains the currently selected colorOption
      selectedColorwayIndex = -1, //The index of the selected product used to determine if we need to expand the colorway list
      expandedHeight; //If the section should render expanded (because the selected item is not visible collapsed) this is the height it should be set to.


      //Set max items per row based on if we are displaying swatches or not
      maxItemsPerRow = colorOptionsConfig[config.colorwayStatus].maxPerRow.lgScreen;
      maxItemsPerRowSmallScreen = colorOptionsConfig[config.colorwayStatus].maxPerRow.smScreen;//MAX_COLOR_OPTIONS_PER_ROW_SM_SCREEN;

      var screenSize = isSmallScreen ? colorOptionsConfig[config.colorwayStatus].maxPerRow.smScreen : colorOptionsConfig[config.colorwayStatus].maxPerRow.lgScreen;
      isMultiRow = config.colorwayList.length > screenSize/2 &&  inStock;

      //Setup flags for selected and if colorway should have a border
      for(i = 0, L=config.colorwayList.length; i < L; i++){
        currentColorway = config.colorwayList[i];

        //If the current colorway is selected set a flag on it and the group it belongs to
        if(currentColorway.productId == config.selectedProductId){
          isSelectedColorwayList = true;
          currentColorway.selected = true;
          selectedColorwayIndex = i;
        }
      }

      //Add custom messages
      // update the markup from the CMS to match StyleGuide
      if(isSelectedColorwayList && config.customColorwayGeneralMessage){
        customColorwayGeneralMessage = config.customColorwayGeneralMessage.replace('<div>','<div class="exp-title nsg-font-family--platform">');
      }

      if(config.customMessages[config.colorwayStatus]){
        customMessage = config.customMessages[config.colorwayStatus].replace('<div>','<div class="exp-title nsg-font-family--platform">');
      }


      //Setup title based on colorwayStatus
      switch(config.colorwayStatus){
        case nike.exp.global.ColorwayStatus.PREORDER_IN_STOCK:
          title = nike.exp.global.LocalValueUtil.getLocal("gridwall.preOrder");
          break;

        case nike.exp.global.ColorwayStatus.COMING_SOON:
          title = nike.exp.global.LocalValueUtil.getLocal("gridwall.comingSoon");
          break;

        case nike.exp.global.ColorwayStatus.OUT_OF_STOCK:
          title = nike.exp.global.LocalValueUtil.getLocal("gridwall.nostock");
          break;

        default:
          break;
      }

      //Check if we have an expanded height value and we need to set the expanded height for the current colorway section
      if(config.colorwayHeightInfo && config.colorwayHeightInfo.expandedHeight &&
         showColorwayExpanded(selectedColorwayIndex, isSmallScreen ? maxItemsPerRowSmallScreen : maxItemsPerRow, config.colorwayList.length)){
        expandedHeight =  config.colorwayHeightInfo.expandedHeight;
      }

      return  {
        displayColorwayControls : config.colorwayList.length > maxItemsPerRow,
        displayColorwayControlsOnSmallScreen: config.colorwayList.length > maxItemsPerRowSmallScreen,
        isMultiRow : isMultiRow,
        selectedProductId: config.selectedProductId,
        title: title,
        status : config.colorwayStatus,
        inStock : inStock,
        showPreorderMessage : isSelectedColorwayList && config.colorwayStatus == nike.exp.global.ColorwayStatus.PREORDER_IN_STOCK,
        showComingSoonMessage : isSelectedColorwayList && config.colorwayStatus == nike.exp.global.ColorwayStatus.COMING_SOON,
        showOutOfStockMessage : isSelectedColorwayList && config.colorwayStatus == nike.exp.global.ColorwayStatus.OUT_OF_STOCK,
        colorOptions: config.colorwayList,
        displayNikeIdLinkForOutOfStock : config.nikeIdMatch && config.colorwayStatus == nike.exp.global.ColorwayStatus.OUT_OF_STOCK,
        nikeIdMatch : config.nikeIdMatch,
        nikeIdBuilderUrl : config.nikeIdBuilderUrl,
        customColorwayGeneralMessage : customColorwayGeneralMessage,
        customMessage : customMessage,
        isNFL : isNFL,
        notifyMe: pdpData.notifyMe,
        expandedHeight : expandedHeight,
        preOrderMessageWithDate : config.preOrderMessageWithDate,
        isPageLoad: isPageLoad,
        hideColorWays: config.hideColorWays
      };
    }


    /**
     * Determine if we should show the colorway section expanded so the selected product is visible in the colorway list
     *
     * @param {integer} selectedColorwayIndex
     * @param {integer} maxItemsPerRow
     */
    function showColorwayExpanded(selectedColorwayIndex, maxItemsPerRow, totalColors){
      var ret = false;
      //Check if selectedProduct is not visible when the section is collapsed
      //A dropdown arrow appears in the last item slot if there more color options than maxItemsPerRow,
      // so we subtract 1 from the maxItems when comparing to the selected index.
      if(selectedColorwayIndex >= maxItemsPerRow - 1 && totalColors > maxItemsPerRow){
        ret = true;
      }
      return ret;
    }
  });


  Handlebars.registerHelper("determineArrowClasses", function(altImages){
    var vertImageBreak = 7;
    var horizontalImageBreak = 5;
    var showVerticalArrows = altImages.length > vertImageBreak;
    var showHorizontalArrows = altImages.length > horizontalImageBreak;
    var arrowClasses = showVerticalArrows ? ' exp-pdp-show-vert-arrows ' : ' ';
    arrowClasses += showHorizontalArrows ? ' exp-pdp-show-horiz-arrows ' : ' ';

    return arrowClasses;
  });

  Handlebars.registerHelper("determineViewportClasses", function(altImages){
    var imageCount = altImages.length;
    var viewportClasses = "";
    if(imageCount == 7){
      viewportClasses += " seven-images";
    } else if(imageCount == 5){
      viewportClasses += " five-images";
    } else if (imageCount <= 4){
      viewportClasses += " four-or-less-images";
    }

    return viewportClasses;
  });

  Handlebars.registerHelper("generatePdpImageActiveClass", function(index){
    return index == 0 ? "exp-pdp-active" : '';
  });

  Handlebars.registerHelper("getBgColor", function(image){
    return IMAGE_BG_MAP[image];
  });

  Handlebars.registerHelper("getImageParams", function(typeString){
    var params = "?";
    var imageParamObj = IMAGE_PARAMS[typeString];
    var indexholder = 0;
    for(var param in imageParamObj) {
      if(indexholder != 0){
        params += '&';
      }
      params += param + "=" +imageParamObj[param];
      indexholder++;
    };
    return params;
  });

  Handlebars.registerHelper("buildGiftCardUrl", function(){
    return nike.getRootUrl() + nike.COUNTRY.toLowerCase() +
           "/" + nike.LOCALE.toLowerCase() + "/?l=shop,gift_cards";
  });

  Handlebars.registerHelper("buildSocialMarkup", function(obj){
    var markup= "";

    if (Handlebars.templates.SocialTools) {
      obj.lang = nike.LANGUAGE;
      markup = Handlebars.templates.SocialTools(obj);
    }

    return new Handlebars.SafeString(markup);

  });

  /**
   * Block helper that takes the video ID and matches it with one of the thumbnail images from the
   * VideoImagesResult object and then builds the image object in the template.
   */
  Handlebars.registerHelper("getMatchingVideo", function (assetId, context, options) {
    var fn = options.fn,
    inverse = options.inverse,
    i = 0,
    ret = "";
    var data;

    if (options.data) {
      data = Handlebars.createFrame(options.data);
    }

    if(context && typeof context === 'object') {
      for(var j = context.length; i<j; i++) {
        if (context[i].id == assetId) {
          if (data) { data.index = i; }
          ret = ret + fn(context[i], { data: data });
        }
      }
    }

    if(i === 0){
      ret = inverse(this);
    }
    return ret;
  });


  /**
   * This block helper checks if Access Code is enabled and if the page is lucked.
   * Will pass only if accessCode is true AND isUnlocked is false
   */
  Handlebars.registerHelper("ifAccessCodeLocked", function (isAccessCodeEnabled, isUnlocked, options) {
    if (isAccessCodeEnabled && !isUnlocked) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });

  Handlebars.registerHelper("ifAccessCodeOrComingSoon", function (isAccessCodeEnabled, isComingSoon, options) {
    if (isAccessCodeEnabled || isComingSoon) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });

  Handlebars.registerHelper("setupDpidMarkup", function(dpid, personalize, options){
    if( personalize && dpid ){
      return options.fn(this);
    }else if( personalize && !dpid ){
      return options.inverse(this);
    }
  });

  /**
   * They want the same container styling if any of the Colorways are personalizable
   */
  Handlebars.registerHelper("setDpidContainerClass", function(personalize, options){
    if( personalize ){
      return options.fn(this);
    }else{
      return options.inverse(this);
    }
  });

  /*********************************************
   *             Utility Helpers                *
   *********************************************/

  /**
   * This is a block helper so you must add a "#" before compare.
   * eg. {{#compare something "==" somethingelse}}<!--stuff to show here -->{{/compare}}
   * If you only use two values (without putting in an operator), then it defaults to "===".
   */
  Handlebars.registerHelper("compare", function (lvalue, operator, rvalue, options) {
    var operators, result;

    if (arguments.length < 3) {
      throw new Error("Handlerbars Helper 'compare' needs 3 parameters");
    }

    if (options === undefined) {
      options  = rvalue;
      rvalue   = operator;
      operator = "===";
    }

    operators = {
      '=='    : function (l, r) { return l ==  r; },
      '==='   : function (l, r) { return l === r; },
      '&&'    : function (l, r) { return l &&  r; },
      '||': function (l, r) { return l || r; },
      '!='    : function (l, r) { return l !=  r; },
      '!=='   : function (l, r) { return l !== r; },
      '<'     : function (l, r) { return l <   r; },
      '>'     : function (l, r) { return l >   r; },
      '<='    : function (l, r) { return l <=  r; },
      '>='    : function (l, r) { return l >=  r; },
      'typeof': function (l, r) { return typeof l == r; },
      'match' : function (l, r) { return (new RegExp(r)).test(l)}
    };

    if (!operators[operator]) {
      throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + operator);
    }

    result = operators[operator](lvalue, rvalue);

    if (result) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });

  /**
   * @return  <String> String with search term replaced
   */
  Handlebars.registerHelper("SearchReplace", function(value, searchTerm, replaceTerm){
    return value.replace(/searchTerm/, /replaceTerm/);
  });

  /**
   * Checks the renderDataQA attribute. If set to true, inserts the data-qa attribute
   * for automation. Requires the attribute value to be passed in as dataQaValue parameter.
   *
   * Also allows passing in an index for cases where you are creating a series of objects.
   * Doing so will result in the index value + 1 in the output.
   *
   * Usage examples:
   * {{buildQaAttr "foo"}} would become: data-qa="foo"
   * {{buildQaAttr "foo_" @index}} where the current index=0 would become: data-qa="foo_1"
   */

  Handlebars.registerHelper("buildQaAttr", function(dataQaValue, index) {
    var attribute;
    var qaValue = dataQaValue;

    if (typeof index === "number") {
      qaValue += (index + 1);
    }

    if (nike.ENV_CONFIG && nike.ENV_CONFIG.renderDataQA == "true") {
      attribute = nike.DATA_QA + '="' + qaValue + '"';
    } else {
      attribute = "";
    }
    return new Handlebars.SafeString(attribute);
  });

  Handlebars.registerHelper("formatDisplaySize", function(displaySize, displaySizeType) {
    var formattedSize = "";
    if (displaySizeType && displaySizeType != "") {
      formattedSize = displaySizeType + " ";
    }

    formattedSize += displaySize;
    return new Handlebars.SafeString(formattedSize)
  });


  /**
   * Adds the height and width attributes that are passed in as params to the image URL
   * for the purposes of requesting the right size from scene7. Outputs the image as JPG.
   *
   * Usage example:
   * {{resizeImage imageUrl 300 200}}
   * Output:
   * http://imageUrl?fmt=jpg&qty=85&wid=300&hei=200
   *
   * Can take a parameter for the background color. The available parameter options for
   * the colorKey are defined in the IMAGE_BG_MAP object.
   */
  Handlebars.registerHelper("resizeImage", function(imageUrl, w, h, colorKey){
    var bgc = (IMAGE_BG_MAP[colorKey]) ? '&bgc='+IMAGE_BG_MAP[colorKey] : '';

    return imageUrl.split('?')[0] + "?fmt=jpg&qty=85&wid=" + w + "&hei=" + h + bgc;
  });

  /**
   * This acts as a for loop in Handlebars.  The block variable is whatever is
   * contained between the opening and closing tags (e.g. {{#for 1 10}}block{{/for}})
   */
  Handlebars.registerHelper("for", function(from, to, block) {
    var accum = '';
    for(var i = from; i <= to; i++) {
      accum += block.fn(i);
    }
    return accum;
  });

  /**
   * Stringify a JS object
   */
  Handlebars.registerHelper("stringify", function(object) {
    return JSON.stringify(object);
  });

  Handlebars.registerHelper("buildStepListDecorator", function(step){
    var stepString = "";
    var stringStep  = step.toString();

    if(stringStep.indexOf("<li>") != -1 || stringStep.indexOf("<ul>") != -1){
      stepString = stringStep;
      //return new Handlebars.SafeString(step);
    } else if(step.indexOf("<p>") == -1){
      stepString = "<p>"+stringStep+"</p>";
    } else if(stringStep == "" || stringStep == " "){
      stepString = "";
    } else {
      stepString = stringStep;
    }
    return new Handlebars.SafeString(stepString);

  });

  Handlebars.registerHelper("foreach",function(arr,options) {
    if(options.inverse && !arr.length){
      return options.inverse(this);
    }

    return _.map(arr, function(item,index) {
      item.$index = index;
      item.$first = index === 0;
      item.$second = index === 1;
      item.$last = index === arr.length-1;
      return options.fn(item);
    }).join('');
  });

  Handlebars.registerHelper("isOddRow", function(rawValue, options){
    var rawValue = rawValue +1; //index starts with 0, so making it start with 1
    if (+rawValue % 2) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });

  Handlebars.registerHelper("splitBySlash", function(value){
    if(value.length > 10){
      return value.split("/").join(' /');
    }
    return value;
  });

  Handlebars.registerHelper("setIndex", function(value){
    this.index = Number(value);
  });

  Handlebars.registerHelper("replaceCSSClassName", function(txt){
    return (txt != null && txt != undefined) ? txt.split(' ').join('-').toLowerCase() : '';
  });

  Handlebars.registerHelper("rowSpanHelper", function(rows){
    return rows.length;
  });

  Handlebars.registerHelper("htmlElementParser",function(element){
    return new Handlebars.SafeString(element);
  });

  Handlebars.registerHelper("changeToClassName", function(someString){
    var someClassName = "exp-pdp-";
    var stringHolder = [];
    stringHolder = someString.split(' ');
    for(var i = 0; i < stringHolder.length; i++){
      someClassName += stringHolder[i].toLowerCase();
      //using index to make sure this isn't the last one
      if(stringHolder.length - 1 != i){
        someClassName += "-";
      }
    }
    return someClassName
  });

  Handlebars.registerHelper("buildOnestoreCartURL", function() {
    return nike.getServiceUrl("oneStoreCartURL");
  });

  Handlebars.registerHelper("buildOnestoreCheckoutURL", function() {
    return nike.getServiceUrl("oneStoreCheckoutURL");
  });

  Handlebars.registerHelper("buildNFLLandingURL", function (slugName) {
    var rootUrl = nike.getServiceUrl("baseBrandURL") + nike.COUNTRY.toLowerCase() + "/" + nike.LOCALE.toLowerCase() + "/";
    var buildUrl = rootUrl + "c/nfl/";

    if (slugName !== "NFLlogo") {
      buildUrl += slugName.split(' ').join('-').toLowerCase();
    }

    return buildUrl;
  });

  Handlebars.registerHelper("buildCountryOfOrigin", function(countryList){
    var labelStr = nike.exp.global.LocalValueUtil.getLocal('pdp.countryOfOrigin') + ' ';
    if(countryList != null && countryList.length > 0) {
      if(countryList.length == 1) {
        return labelStr + countryList[0];
      }else {
        var corStr = countryList[0];
        for(var i=1; i<countryList.length; i++) {
          corStr = corStr + ', ' + countryList[i];
        }
        return labelStr + corStr;
      }
    }
    return '';
  });

  /**
   * Changing Slug to "sm" for share urls
   * EDF-19603
   */
  Handlebars.registerHelper("socialMediaHelper", function(url){
    var REGEX_FOR_SLUG =  /(^.*pd\/).*(\/pid.*)/i;
    var newUrl = url;
    var arr = REGEX_FOR_SLUG.exec(url);
    if(arr){
      newUrl = arr[1] + "sm" + arr[2];
    }
    return new Handlebars.SafeString(newUrl);
  });

  // determine what's out of stock
  function findNotifiableColorways(buyingTools) {
    var notifiable = new Array();
    for(var i=0; i < buyingTools.skuList.length; i++){
      var currSku = buyingTools.skuList[i];
      if(!currSku.inStock){
        notifiable.push(currSku);
      }
    }
    return notifiable;
  }

  /**
   * Applies NSG classes to mark up blocks that we get from the model so that it gets the proper styling
   */
  Handlebars.registerHelper("addStyleGuideClassesToH2Blocks", function(message){
    var markup = '';

    if (message) {
      markup = message.replace(/<(h)2>/ig, '<$12 class="exp-title nsg-font-family--platform">');
    }
    return new Handlebars.SafeString(markup);
  });

  /**
   * Digital PiD Helper
   */
  Handlebars.registerHelper('DigitalPiDLayout', function(context, options){
    var i = 0;
    var rows = [];

    if(context && typeof context === 'object') {
      if(context instanceof Array){
        //here we're sorting by tabOrder
        var sortedArray = context.sort(function(a, b){
          if(a.tabOrder > b.tabOrder){
            return 1;
          }
          if(a.tabOrder < b.tabOrder){
            return -1;
          }
          return 0;
        });
        //after sorting we send them to get massaged into rows
        var row = [];
        for(var j = sortedArray.length; i<j; i++) {
          var curr = sortedArray[i];
          if(curr.labelValue !== '' && curr.labelValue !== null){
            if(row.length > 0){
              rows.push(row);
              row = [];
            }
          }
          //at this point in time there can only be 2 in a row
          if(row.length === 1){
            if( +row[0].characterLimit > +curr.characterLimit ){
              //long-short class
              row[0].additionalClass = 'pid-layout-long-short';
              curr.additionalClass = 'pid-layout-long-short';
            } else {
              //short-long class
              row[0].additionalClass = 'pid-layout-short-long';
              curr.additionalClass = 'pid-layout-short-long';
            }
          }
          row.push(curr);
        }
        //Don't want to leave out the orphans...
        if(rows.indexOf(row) == -1){
          rows.push(row);
        }
      }
    }
    return options.fn({rows:rows});
  });

  Handlebars.registerHelper("capitalizeProductTitle", function(title) {
    if (title){
      title = title
        .toUpperCase()
        .replace(/\bNIKE ID\b|\bNIKEID\b/g, "NIKEiD")
        .replace(/\bID\b/g, "iD")
        .replace(/\bIPOD\b/g, "iPod")
        .replace(/\bIPODS\b/g, "iPod");

      return new Handlebars.SafeString(title);
    }
  });
  
}();

}catch(ex){
if(nike.error){
nike.error('An unhandled exception was thrown while executing nike.exp.pdp.PdpTemplateHelpers. Make sure to look for previous errors because this might have failed as a result of another script failing', ex, 'Stack:', ex.stack, 'Message:', ex.message);
}
}
try{
var nike = nike || {};
if(nike.namespace){nike.namespace('nike.exp.pdp.templates.desktop.BuyingToolsModule');}
   (function() { 
     var template = Handlebars.template, 
         templates = Handlebars.templates = Handlebars.templates || {}; 
     templates['BuyingToolsModule'] = template({"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.accessCode : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0, blockParams, depths),"inverse":container.program(4, data, 0, blockParams, depths),"data":data})) != null ? stack1 : "");
},"2":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "      <div class=\"save-container\">\n        <button type=\"button\" class=\"exp-pdp-unlock-button js-pdp-redirect-button nsg-button nsg-grad--nike-orange\" "
    + alias3((helpers.addQaAttribute || (depth0 && depth0.addQaAttribute) || alias2).call(alias1,"pdp.access-code.unlock",{"name":"addQaAttribute","hash":{},"data":data}))
    + " data-url=\""
    + alias3(((helper = (helper = helpers.url || (depth0 != null ? depth0.url : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"url","hash":{},"data":data}) : helper)))
    + "\">\n          "
    + alias3((helpers.getLocal || (depth0 && depth0.getLocal) || alias2).call(alias1,"buyingtools.accesscode.unlock",{"name":"getLocal","hash":{},"data":data}))
    + "\n        </button>\n      </div>\n";
},"4":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.showSizeAndFitLink : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n      <form action=\""
    + alias4(((helper = (helper = helpers.pdpUrl || (depth0 != null ? depth0.pdpUrl : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"pdpUrl","hash":{},"data":data}) : helper)))
    + "\" method=\"post\" class=\"add-to-cart-form nike-buying-tools\">\n        <input type=\"hidden\" name=\"action\" value=\"addItem\"/>\n        <input type=\"hidden\" name=\"lang_locale\" value=\""
    + alias4((helpers.getAppConfigProperty || (depth0 && depth0.getAppConfigProperty) || alias2).call(alias1,"LOCALE",{"name":"getAppConfigProperty","hash":{},"data":data}))
    + "\"/>\n        <input type=\"hidden\" name=\"country\" value=\""
    + alias4((helpers.getAppConfigProperty || (depth0 && depth0.getAppConfigProperty) || alias2).call(alias1,"COUNTRY",{"name":"getAppConfigProperty","hash":{},"data":data}))
    + "\"/>\n        <input type=\"hidden\" name=\"catalogId\" value=\""
    + alias4(((helper = (helper = helpers.catalogId || (depth0 != null ? depth0.catalogId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"catalogId","hash":{},"data":data}) : helper)))
    + "\"/>\n        <input type=\"hidden\" name=\"productId\" value=\""
    + alias4(((helper = (helper = helpers.productId || (depth0 != null ? depth0.productId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"productId","hash":{},"data":data}) : helper)))
    + "\"/>\n        <input type=\"hidden\" name=\"price\" value=\""
    + alias4(((helper = (helper = helpers.rawPrice || (depth0 != null ? depth0.rawPrice : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"rawPrice","hash":{},"data":data}) : helper)))
    + "\"/>\n        <input type=\"hidden\" name=\"siteId\" value=\""
    + alias4(((helper = (helper = helpers.siteId || (depth0 != null ? depth0.siteId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"siteId","hash":{},"data":data}) : helper)))
    + "\"/>\n        <input type=\"hidden\" name=\"line1\" value=\""
    + alias4(((helper = (helper = helpers.productTitle || (depth0 != null ? depth0.productTitle : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"productTitle","hash":{},"data":data}) : helper)))
    + "\"/>\n        <input type=\"hidden\" name=\"line2\" value=\""
    + alias4(((helper = (helper = helpers.productSubTitle || (depth0 != null ? depth0.productSubTitle : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"productSubTitle","hash":{},"data":data}) : helper)))
    + "\"/>\n        <input type=\"hidden\" name=\"passcode\" "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.passcode : depth0),{"name":"if","hash":{},"fn":container.program(8, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "/>\n        <input type=\"hidden\" name=\"sizeType\" value=\""
    + alias4(container.lambda(((stack1 = (depth0 != null ? depth0.skuContainer : depth0)) != null ? stack1.displaySizeTypeLabel : stack1), depth0))
    + "\"/>\n\n        <div class=\"buying-tools-container\">\n          <div class=\"size-and-quantity-container\">\n            <div class=\"dropdown-container size-container nsg-form--drop-down"
    + ((stack1 = (helpers.compare || (depth0 && depth0.compare) || alias2).call(alias1,((stack1 = ((stack1 = (depth0 != null ? depth0.skuContainer : depth0)) != null ? stack1.productSkus : stack1)) != null ? stack1.length : stack1),"===",1,{"name":"compare","hash":{},"fn":container.program(10, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\">\n              <a class=\"nsg-form--drop-down--label nsg-grad--light-grey nsg-form--drop-down exp-pdp-size-dropdown exp-pdp-dropdown selectBox-dropdown\" "
    + alias4((helpers.buildQaAttr || (depth0 && depth0.buildQaAttr) || alias2).call(alias1,"pdp.buyingtools.size.dropdown.label",{"name":"buildQaAttr","hash":{},"data":data}))
    + ">\n                <span class=\"js-selectBox-label\">"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.customSizeLabel : depth0),{"name":"if","hash":{},"fn":container.program(12, data, 0, blockParams, depths),"inverse":container.program(14, data, 0, blockParams, depths),"data":data})) != null ? stack1 : "")
    + " </span>\n                <span class=\"js-selectBox-value nsg-form--drop-down--selected-option\"></span>\n              </a>\n              <select name=\"skuAndSize\" class=\"nsg-form--drop-down nsg-drop-down size-dropdown two-column-dropdown\" data-has-fixed-ancestor=\"false\" data-tooltiptext=\""
    + alias4((helpers.getLocal || (depth0 && depth0.getLocal) || alias2).call(alias1,"pdp.sizeselect.ada.label",{"name":"getLocal","hash":{},"data":data}))
    + "\" data-error=\""
    + alias4((helpers.getLocal || (depth0 && depth0.getLocal) || alias2).call(alias1,"pdp.sizeselect.ada.label",{"name":"getLocal","hash":{},"data":data}))
    + "\" "
    + alias4((helpers.buildQaAttr || (depth0 && depth0.buildQaAttr) || alias2).call(alias1,"pdp.buyingtools.size",{"name":"buildQaAttr","hash":{},"data":data}))
    + ">\n                <option class=\"size-not-in-stock\" value=\"\"></option>\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.skuContainer : depth0),{"name":"if","hash":{},"fn":container.program(16, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "              </select>\n            </div>\n\n            <div class=\"dropdown-container quantity-container nsg-form--drop-down\">\n              <a class=\"nsg-form--drop-down--label nsg-grad--light-grey nsg-form--drop-down exp-pdp-quantity-dropdown exp-pdp-dropdown selectBox-dropdown\" "
    + alias4((helpers.buildQaAttr || (depth0 && depth0.buildQaAttr) || alias2).call(alias1,"pdp.buyingtools.qty.dropdown.label",{"name":"buildQaAttr","hash":{},"data":data}))
    + ">"
    + alias4((helpers.getLocal || (depth0 && depth0.getLocal) || alias2).call(alias1,"pdp.quantity.label",{"name":"getLocal","hash":{},"data":data}))
    + "\n                <span class=\"nsg-form--drop-down--selected-option quantity-value\"></span>\n              </a>\n              <select name=\"qty\" class=\"nsg-form--drop-down quantity-dropdown dropdown\"\n                      data-has-fixed-ancestor=\"false\"\n                "
    + alias4((helpers.buildQaAttr || (depth0 && depth0.buildQaAttr) || alias2).call(alias1,"pdp.buyingtools.quantity",{"name":"buildQaAttr","hash":{},"data":data}))
    + ">\n"
    + ((stack1 = (helpers["for"] || (depth0 && depth0["for"]) || alias2).call(alias1,1,(depth0 != null ? depth0.quantityLimit : depth0),{"name":"for","hash":{},"fn":container.program(20, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "              </select>\n            </div>\n          </div>\n\n          <div class=\"save-container\">\n            <button type=\"submit\" class=\"add-to-cart nsg-button nsg-grad--nike-orange\" "
    + alias4((helpers.buildQaAttr || (depth0 && depth0.buildQaAttr) || alias2).call(alias1,"pdp.buyingtools.add-to-cart",{"name":"buildQaAttr","hash":{},"data":data}))
    + ">\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.preOrder : depth0),{"name":"if","hash":{},"fn":container.program(22, data, 0, blockParams, depths),"inverse":container.program(24, data, 0, blockParams, depths),"data":data})) != null ? stack1 : "")
    + "            </button>\n          </div>\n        </div>\n      </form>\n\n      <div class=\"add-to-cart-timeout-modal-content is-hidden\">\n        <div class=\"add-to-cart-header-container add-to-cart-border\">\n        <span class=\"add-to-cart-header nsg-text--dark-grey edf-title-font-size--xlarge nsg-font-family--platform\">\n          "
    + alias4((helpers.getLocal || (depth0 && depth0.getLocal) || alias2).call(alias1,"pdp.error.cartTimeout.title",{"name":"getLocal","hash":{},"data":data}))
    + "\n        </span>\n        </div>\n        <hr class=\"exp-pdp-separator\">\n        <div class=\"add-to-cart-text-container\">\n        <span class=\"add-to-cart-text nsg-text--medium-grey nsg-font-family--base\">\n          "
    + alias4((helpers.getLocal || (depth0 && depth0.getLocal) || alias2).call(alias1,"pdp.error.cartTimeout.message",{"name":"getLocal","hash":{},"data":data}))
    + "\n        </span>\n        </div>\n        <div class=\"modal-button-container\">\n          <div class=\"add-to-cart-button-container-left\">\n            <button class=\"nsg-button nsg-grad--nike-orange ok\">\n              "
    + alias4((helpers.getLocal || (depth0 && depth0.getLocal) || alias2).call(alias1,"pdp.error.cartButton",{"name":"getLocal","hash":{},"data":data}))
    + "\n            </button>\n          </div>\n        </div>\n      </div>\n";
},"5":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "        <div class=\"size-fit-link-container\" "
    + alias3((helpers.buildQaAttr || (depth0 && depth0.buildQaAttr) || alias2).call(alias1,"pdp.buyingtool.sizefitguide",{"name":"buildQaAttr","hash":{},"data":data}))
    + ">\n          <a class=\"open-size-and-fit underline\" data-tab=\"fit-tab\""
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.sizeAndFitGuideUrl : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " href=\"#\">\n            "
    + alias3((helpers.getLocal || (depth0 && depth0.getLocal) || alias2).call(alias1,"service.fit.fitGuide.title",{"name":"getLocal","hash":{},"data":data}))
    + "\n          </a>\n        </div>\n";
},"6":function(container,depth0,helpers,partials,data) {
    var helper;

  return "\n             data-window-location=\""
    + container.escapeExpression(((helper = (helper = helpers.sizeAndFitGuideUrl || (depth0 != null ? depth0.sizeAndFitGuideUrl : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"sizeAndFitGuideUrl","hash":{},"data":data}) : helper)))
    + "\"";
},"8":function(container,depth0,helpers,partials,data) {
    var helper;

  return " value=\""
    + container.escapeExpression(((helper = (helper = helpers.passcode || (depth0 != null ? depth0.passcode : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"passcode","hash":{},"data":data}) : helper)))
    + "\"";
},"10":function(container,depth0,helpers,partials,data) {
    return " one-item ";
},"12":function(container,depth0,helpers,partials,data) {
    var helper;

  return container.escapeExpression(((helper = (helper = helpers.customSizeLabel || (depth0 != null ? depth0.customSizeLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"customSizeLabel","hash":{},"data":data}) : helper)));
},"14":function(container,depth0,helpers,partials,data) {
    return container.escapeExpression((helpers.getLocal || (depth0 && depth0.getLocal) || helpers.helperMissing).call(depth0 != null ? depth0 : {},"pdp.sizeselect.label",{"name":"getLocal","hash":{},"data":data}));
},"16":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.skuContainer : depth0)) != null ? stack1.productSkus : stack1),{"name":"each","hash":{},"fn":container.program(17, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"17":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "                    <option "
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.inStock : depth0),{"name":"unless","hash":{},"fn":container.program(18, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " name=\"skuId\" value=\""
    + alias4(((helper = (helper = helpers.sku || (depth0 != null ? depth0.sku : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"sku","hash":{},"data":data}) : helper)))
    + ":"
    + alias4(((helper = (helper = helpers.displaySize || (depth0 != null ? depth0.displaySize : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"displaySize","hash":{},"data":data}) : helper)))
    + "\" data-label=\"("
    + alias4((helpers.formatDisplaySize || (depth0 && depth0.formatDisplaySize) || alias2).call(alias1,(depth0 != null ? depth0.displaySize : depth0),((stack1 = (depths[1] != null ? depths[1].skuContainer : depths[1])) != null ? stack1.displaySizeTypeLabel : stack1),{"name":"formatDisplaySize","hash":{},"data":data}))
    + ")\">\n                      "
    + alias4((helpers.formatDisplaySize || (depth0 && depth0.formatDisplaySize) || alias2).call(alias1,(depth0 != null ? depth0.displaySize : depth0),((stack1 = (depths[1] != null ? depths[1].skuContainer : depths[1])) != null ? stack1.displaySizeTypeLabel : stack1),{"name":"formatDisplaySize","hash":{},"data":data}))
    + "\n                    </option>\n";
},"18":function(container,depth0,helpers,partials,data) {
    return "class=\"size-not-in-stock selectBox-disabled\"";
},"20":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "                  <option value=\""
    + alias2(alias1(depth0, depth0))
    + "\" data-label=\"("
    + alias2(alias1(depth0, depth0))
    + ")\">"
    + alias2(alias1(depth0, depth0))
    + "</option>\n";
},"22":function(container,depth0,helpers,partials,data) {
    return "                "
    + container.escapeExpression((helpers.getLocal || (depth0 && depth0.getLocal) || helpers.helperMissing).call(depth0 != null ? depth0 : {},"pdp.preorder.label",{"name":"getLocal","hash":{},"data":data}))
    + "\n";
},"24":function(container,depth0,helpers,partials,data) {
    return "                "
    + container.escapeExpression((helpers.getLocal || (depth0 && depth0.getLocal) || helpers.helperMissing).call(depth0 != null ? depth0 : {},"pdp.addtocart.label",{"name":"getLocal","hash":{},"data":data}))
    + "\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return alias3((helpers.requireDependency || (depth0 && depth0.requireDependency) || alias2).call(alias1,"nike.exp.global.TemplateHelpers",{"name":"requireDependency","hash":{},"data":data}))
    + "\n"
    + alias3((helpers.requireDependency || (depth0 && depth0.requireDependency) || alias2).call(alias1,"nike.exp.pdp.TemplateHelpers",{"name":"requireDependency","hash":{},"data":data}))
    + "\n"
    + alias3((helpers.requireDependency || (depth0 && depth0.requireDependency) || alias2).call(alias1,"nike.exp.pdp.PdpTemplateHelpers",{"name":"requireDependency","hash":{},"data":data}))
    + "\n\n<div class=\"buying-tools-module\">\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.showBuyingTools : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>\n";
},"useData":true,"useDepths":true}); 
   })();
}catch(ex){
if(nike.error){
nike.error('An unhandled exception was thrown while executing nike.exp.pdp.templates.desktop.BuyingToolsModule. Make sure to look for previous errors because this might have failed as a result of another script failing', ex, 'Stack:', ex.stack, 'Message:', ex.message);
}
}
try{
var nike = nike || {};
nike.namespace('nike.exp.pdp.desktop.BuyingTools');

nike.requireDependency("jQuery");
nike.requireDependency("nike.EventBus");
nike.requireDependency("nike.exp.pdp.base.BuyingTools");
nike.requireDependency('nike.ServiceUtil');
nike.requireDependency('nike.Cart');
nike.requireDependency('nike.style.nsg.Classes'); // not sure if we need this ?? PdpPage.js has it for inline
nike.requireDependency('HandlebarsRuntime');
nike.requireDependency('nike.exp.pdp.PdpToolTip');
nike.requireDependency('nike.exp.pdp.templates.desktop.BuyingToolsModule');
nike.requireDependency('nike.exp.global.SelectBox');
nike.requireDependency('nike.exp.pdp.PdpTemplateHelpers');
nike.requireDependency('lib.lodash');

/**
* Buying Tools Module for PDPs 
*/
(function() {

  nike.exp.pdp.desktop.BuyingTools = nike.exp.pdp.base.BuyingTools.extend({

    CLASS_INVALID : 'is-invalid',

    init: function() {
      this._super();
      this.template = "BuyingToolsModule";
      this.isOnlyOneInStock = 0;

      this.$form = null;
      this.$sizeSelect = null;
      this.$sizeContainer = null;
      this.$sizeSelectLabel = null;
      this.$sizeSelectValue = null;
      this.$sizeNotInStock = null;
      this.sizeWrapper = null;
      this.$quantitySelect = null;
    },

    initSelectors : function() {
      if (this.$element) {
        this.$form = this.$element.find('.add-to-cart-form');
        this.$addToCartButton = this.$element.find('button.add-to-cart');
        this.$sizeSelect = this.$element.find('select.size-dropdown');
        this.$sizeContainer = this.$element.find('.size-container');
        this.$sizeSelectLabel = this.$element.find('.size-label');
        this.$sizeSelectValue = this.$element.find('.size-value');
        this.$sizeNotInStock = this.$element.find('.size-not-in-stock');
        this.$quantitySelect = this.$element.find('select.quantity-dropdown');
        this.sizeWrapper = 'size-dropdown-container';
        this.initSelects();
      }
    },

    /**
    * Customize NSG DropDown menu - sizeWrapper holds the grid of size options
    * Unbind the click events for out-of-stock list options in the size drop-down
    * Modify select label if product has 1 size or if there's 1 size left in stock
    */
    initSelects : function() {
      if($.fn.nsgDropDown){
        this.$sizeSelect.nsgDropDown({ autoWidth: false, parentOffset: true });
        this.$quantitySelect.nsgDropDown({ autoWidth: false, parentOffset: true });
        this.$sizeSelect.nsgDropDown('addWrapper', this.sizeWrapper);
        this.$sizeContainer.find('li'+'.size-not-in-stock').unbind().click(function(event){ event.preventDefault(); });

        if (this.viewModel &&
            this.viewModel.skuContainer &&
            !this.viewModel.skuContainer.multiSku &&
            this.viewModel.skuContainer.productSkus &&
            this.viewModel.skuContainer.productSkus[0].sizeDescription === 'ONE SIZE') {
          this.$form.find('.js-selectBox-label').text('');
        }

        this.resetDropdowns();
        this.initSizeSelectToolTip();
      } else {
        //TODO This shouldn't have to be done here but for some reason we aren't getting initialized
        nike.error("NSG not defined, setting timeout");
        try{
          nsg.init();
        } catch(e){

        }
        setTimeout($.proxy(this.initSelects, this), 500);
      }

    },

    initSizeSelectToolTip : function(){
      if(this.$element){
        //set up size tool tip
        this.sizeToolTip = new nike.exp.pdp.PdpToolTip({
          tipText : this.$sizeSelect.data("tooltiptext"),
          parent: $(this.$sizeContainer),
          qaAttr : ""
        })
      }
    },

    initEventListeners : function() {
      this.$form.submit($.proxy(this.addToCart, this));
      this.$sizeSelect.change($.proxy(this.handleSizeSelectChange, this));
      this.$element.on('click', '.open-size-and-fit', this.handleSizeChartClick);
      this.$element.on('click', '.js-pdp-redirect-button', $.proxy(this.handleRedirectToPDP, this));

      // Disable out of stock options in the size drop-down
      this.$sizeNotInStock.unbind().click(function(event){ event.preventDefault(); });

    },

    setViewModel : function(data) {
      if (data) {
        data.isTablet = $('body').hasClass('Tablet');

        if(data.skuContainer){
          data.skuContainer.skusInStock = _.filter(data.skuContainer.productSkus, function(sku){
            return sku.inStock;
          });
          data.skuContainer.oneSkuInStock = data.skuContainer.skusInStock.length === 1;
        }
      }
      this.setUpQtyLimit(data);
      this._super(data);
    },

    /**
     * Navigate to the pdp when the user clicks the unlock or see details button.
     * @param event Jquery event
     */
    handleRedirectToPDP: function(event){
      var url = $(event.currentTarget).data('url');
      this.redirect(url);
    },

    /**
     * Sets the window.location to the provided URL param.
     * @param url
     */
    redirect: function(url){
      window.location = url;
    },

    /**
    * Handles click event on size chart link
    */
    handleSizeChartClick : function(event) {
      event.preventDefault();
      event.stopImmediatePropagation();

      var el = $(this);
      var wL = el.data('windowLocation');
      //analytics
      nike.dispatchEvent(nike.gadget.Event.SHOW_SIZE_CHART, {});
      if (wL) {
        var sfgUrl = nike.SERVICE_URLS.baseBrandURL + nike.COUNTRY.toLowerCase() + '/' + nike.LOCALE.toLowerCase() + '/sfg/' + wL;
        window.open(sfgUrl, 'sizeAndFit', 'width=760,height=600,location=yes,menubar=no,resizable=yes,scrollbars=yes,status=yes,titlebar=no,toolbar=no');
      } else {
        if (nike.objectDefined('nike.exp.pdp.PdpPage')) {
          nike.exp.pdp.PdpPage.initSizeAndChartModal();
        }

        nike.exp.pdp.TemplateRenderer.renderFitTemplate(nike.exp.pdp.PdpPage.currentProduct.legacySizeFitChart, true);

        if (nike.objectDefined('nike.exp.pdp.PdpPage')) {
          nike.exp.pdp.PdpPage.showSizeAndChartModal();
        }
      }
    },

    /**
    * Handles change events on size selector
    */
    handleSizeSelectChange : function(){
      if (this.$sizeSelect.hasClass('is-invalid')) {
        this.setSizeValid(true);
      }

      var selectedLabel = this.$sizeSelect.find('option:selected').text().trim();

      if(selectedLabel.length > 4){
        var sizeValueMatch =  this.$sizeSelectValue.text().match(/^\((.*?)\)$/);
        this.$sizeSelectLabel.hide();

        if (sizeValueMatch && sizeValueMatch[1]) {
          this.$sizeSelectValue.text(sizeValueMatch[1]);
        }
      } else {
        this.$sizeSelectLabel.show();
      }

      if(!this.$sizeSelect.hasClass('size-not-in-stock')){
        nike.dispatchEvent(nike.Event.SIZE_SELECTION_SELECTED, {selectedSize:selectedLabel});
      }

    },

    /**
    * Adds current item to the cart
    * @param {Event} event The add-to-cart button click event.
    */
    addToCart : function(event){
      event.preventDefault();
      if(this.validateAddTo()){
        this.setSizeValid(true);
        var data = nike.ServiceUtil.getFormData(this.$form);
        // TODO: switch addToCart to promise API
        nike.Cart.addToCart(data, this.$form, $.proxy(this.resetDropdowns, this), $.proxy(this.resetDropdowns, this));

      } else {
        this.setSizeValid(false);
      }

       return false;
    },

    /**
    * Empties the size dropdown and resets the quantity dropdown to 1.
    */
    resetDropdowns : function() {
      if(this.viewModel && this.viewModel.skuContainer && this.viewModel.skuContainer.oneSkuInStock){
        var inStockSku = this.viewModel.skuContainer.skusInStock[0];
        this.$sizeSelect.nsgDropDown('value', inStockSku.sku + ':' + inStockSku.displaySize);
      } else {
        this.$sizeSelect.nsgDropDown('value', null);
      }
      this.$sizeSelect.trigger('change');

      this.$quantitySelect.nsgDropDown('value', null);
    },

    /**
    * Validate the inputs necessary to add an item to cart or locker
    * @return {Boolean} if the state is valid for Add To Cart
    */
    validateAddTo : function(){
      var valid = true;
      if (this.$sizeSelect.length){
        if (this.$sizeSelect.find('option:selected').val().length === 0){
          valid = false;
        }
      }
      return valid;
    },

    /**
    * Style the size dropdown to show as valid or not
    * @param {Boolean} valid - True if the user has selected a size.
    */
    setSizeValid : function(valid){
      if(this.$sizeSelect){
        if(valid){
          this.$sizeSelect.removeClass(this.CLASS_INVALID);
          this.$sizeContainer.removeClass(this.CLASS_INVALID);
          this.sizeToolTip.removeToolTip();
        } else {
          this.$sizeSelect.addClass(this.CLASS_INVALID);
          this.$sizeContainer.addClass(this.CLASS_INVALID);
          this.sizeToolTip.addToolTip();
        }
      }
    }

  });

})();

}catch(ex){
if(nike.error){
nike.error('An unhandled exception was thrown while executing nike.exp.pdp.desktop.BuyingTools. Make sure to look for previous errors because this might have failed as a result of another script failing', ex, 'Stack:', ex.stack, 'Message:', ex.message);
}
}


try{
var nike = nike || {};
nike.namespace("nike.exp.pdp.base.LinkToPdp");

nike.requireDependency("nike.exp.pdp.base.ViewModule");

(function() {

  nike.exp.pdp.base.LinkToPdp = nike.exp.pdp.base.ViewModule.extend({

    init: function() {
      this._super();
    }

  });

})();


}catch(ex){
if(nike.error){
nike.error('An unhandled exception was thrown while executing nike.exp.pdp.base.LinkToPdp. Make sure to look for previous errors because this might have failed as a result of another script failing', ex, 'Stack:', ex.stack, 'Message:', ex.message);
}
}
try{
var nike = nike || {};
if(nike.namespace){nike.namespace('nike.exp.pdp.templates.desktop.LinkToPdpModule');}
   (function() { 
     var template = Handlebars.template, 
         templates = Handlebars.templates = Handlebars.templates || {}; 
     templates['LinkToPdpModule'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "  <div class=\"link-to-pdp-module link_to_pdp\">\n    <a href=\""
    + alias4(((helper = (helper = helpers.url || (depth0 != null ? depth0.url : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"url","hash":{},"data":data}) : helper)))
    + "\" data-name=\""
    + ((stack1 = ((helper = (helper = helpers.displayName || (depth0 != null ? depth0.displayName : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"displayName","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\">"
    + alias4((helpers.getLocal || (depth0 && depth0.getLocal) || alias2).call(alias1,"outfitpdp.productDetailsLink",{"name":"getLocal","hash":{},"data":data}))
    + "</a>\n  </div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.featureFlag || (depth0 && depth0.featureFlag) || helpers.helperMissing).call(depth0 != null ? depth0 : {},"BUYING_TOOLS_PDP",{"name":"featureFlag","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"useData":true}); 
   })();
}catch(ex){
if(nike.error){
nike.error('An unhandled exception was thrown while executing nike.exp.pdp.templates.desktop.LinkToPdpModule. Make sure to look for previous errors because this might have failed as a result of another script failing', ex, 'Stack:', ex.stack, 'Message:', ex.message);
}
}
try{
var nike = nike || {};
nike.namespace("nike.exp.pdp.desktop.LinkToPdp");

nike.requireDependency("nike.exp.pdp.base.LinkToPdp");
nike.requireDependency('nike.exp.global.LocalValueUtil');
nike.requireDependency('HandlebarsRuntime');
nike.requireDependency("nike.exp.pdp.templates.desktop.LinkToPdpModule");
nike.requireAdditionalLocalValues('outfitpdp.productDetailsLink');

/**
 * nike.exp.global.LocalValueUtil.getLocal('mini-PDP.viewdetails')
 */

(function() {

  nike.exp.pdp.desktop.LinkToPdp = nike.exp.pdp.base.LinkToPdp.extend({

    init: function() {
      this._super();
      this.template = "LinkToPdpModule";
    },

    initEventListeners : function(){
      this.$element.on('click touch', "a", $.proxy(this.handleLinkClicked, this) );
    },
    /**
     * Abstracted window.Location(for testability)
     * @param  {String} href - url to navigate to
     * @return {Integer} - setTimeoutId
     */
    redirect: function(href) {
      if(href) {
        return  window.setTimeout(function () {
          window.location.assign(href)
        }, 300);
      }
    },

    handleLinkClicked: function(event) {
      event.preventDefault();
      var $link = $(event.currentTarget);
      nike.dispatchEvent( nike.Event.MINI_PDP_LINK_TO_PRODUCT_CLICKED, {displayName : $link.data('name')} );
      this.redirect($link.attr('href'));
    }

  });

})();


}catch(ex){
if(nike.error){
nike.error('An unhandled exception was thrown while executing nike.exp.pdp.desktop.LinkToPdp. Make sure to look for previous errors because this might have failed as a result of another script failing', ex, 'Stack:', ex.stack, 'Message:', ex.message);
}
}

try{
var nike = nike || {};
nike.namespace("nike.exp.pdp.desktop.VatMessaging");

nike.requireDependency('nike.exp.global.LocalValueUtil');
nike.requireDependency("nike.exp.pdp.base.MiniPdpShell");
nike.requireDependency("nike.exp.pdp.desktop.PdpNotification");
nike.requireDependency("nike.exp.pdp.templates.desktop.PdpNotificationModule");

(function() {

  nike.exp.pdp.desktop.VatMessaging = nike.exp.pdp.desktop.PdpNotification.extend({

    init: function() {
      this._super();
    },

    invalidateViewModel: function() {
      this._super();
      // Show the VAT Message if necessary
      var vatMessage = Handlebars.helpers.buildVATMessage();
      if (vatMessage.string) {
        $vatMessage = $(vatMessage.string);
        $vatMessage.removeClass();
        $vatMessage.find('*').removeClass();
        $vatMessage.addClass('nsg-font-family--base');
        this.addMessage($vatMessage);
      }
    }
  });

})();

}catch(ex){
if(nike.error){
nike.error('An unhandled exception was thrown while executing nike.exp.pdp.desktop.VatMessaging. Make sure to look for previous errors because this might have failed as a result of another script failing', ex, 'Stack:', ex.stack, 'Message:', ex.message);
}
}

try{
var nike = nike || {};
if(nike.namespace){nike.namespace('nike.exp.pdp.templates.desktop.AvailabilityMessagingModule');}
   (function() { 
     var template = Handlebars.template, 
         templates = Handlebars.templates = Handlebars.templates || {}; 
     templates['AvailabilityMessagingModule'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return "      "
    + ((stack1 = ((helper = (helper = helpers.availabilityMessage || (depth0 != null ? depth0.availabilityMessage : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"availabilityMessage","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {};

  return "      <div class=\"exp-title nsg-font-family--platform-i\">\n        "
    + container.escapeExpression(((helper = (helper = helpers.availabilityMessage || (depth0 != null ? depth0.availabilityMessage : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"availabilityMessage","hash":{},"data":data}) : helper)))
    + "\n      </div>\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.availabilityMessageTexts : depth0),{"name":"each","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"4":function(container,depth0,helpers,partials,data) {
    return "        <p>"
    + container.escapeExpression(container.lambda(depth0, depth0))
    + "</p>\n";
},"6":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.prebuildCTA : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"7":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "        <div class=\"availability-message-link-container\">\n          <span class=\"arrow-right nsg-glyph--arrow-right\"></span>\n          <a class=\"availability-message-link exp-customize-it\" href=\""
    + ((stack1 = container.lambda(((stack1 = (depth0 != null ? depth0.prebuildCTA : depth0)) != null ? stack1.url : stack1), depth0)) != null ? stack1 : "")
    + "\">"
    + ((stack1 = (helpers.getLocal || (depth0 && depth0.getLocal) || helpers.helperMissing).call(depth0 != null ? depth0 : {},"pdp.nikeid.customize.nostock",{"name":"getLocal","hash":{},"data":data})) != null ? stack1 : "")
    + "</a>\n        </div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return "<div class=\"pdp-notification-container availability-message-container\" >\n  <div class=\"message\">\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.isCustomMessage : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.inStock : depth0),{"name":"unless","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "  </div>\n</div>\n";
},"useData":true}); 
   })();
}catch(ex){
if(nike.error){
nike.error('An unhandled exception was thrown while executing nike.exp.pdp.templates.desktop.AvailabilityMessagingModule. Make sure to look for previous errors because this might have failed as a result of another script failing', ex, 'Stack:', ex.stack, 'Message:', ex.message);
}
}
try{
var nike = nike || {};
nike.namespace("nike.exp.pdp.desktop.AvailabilityMessaging");

nike.requireDependency("nike.Event");
nike.requireDependency("nike.exp.global.LocalValueUtil");
nike.requireDependency("nike.exp.pdp.desktop.PdpNotification");
nike.requireDependency("nike.exp.pdp.templates.desktop.AvailabilityMessagingModule");

(function() {

  nike.exp.pdp.desktop.AvailabilityMessaging = nike.exp.pdp.desktop.PdpNotification.extend({

    init: function() {
      this._super();
      this.template = "AvailabilityMessagingModule";
      this.showAvailabilityMessage = false;
    },

    initSelectors: function() {
      this.$container = this.$element.find('.availability-message-container');
    },

    initEventListeners: function() {
      // Handle user clicking Customize it with NIKEiD link. It's main purpose is to send tracking
      this.$container.find('.availability-message-link-container').on('click.pdp touch.pdp', 'a.exp-customize-it', function () {
        nike.dispatchEvent(nike.Event.CUSTOMIZE_NIKE_ID_LINK_CLICKED);
      });
    },

    setViewModel: function(data) {
      this.showAvailabilityMessage = false;

      if (data) {
        if (data.showOutOfStockMessage || data.showPreOrderMessage || data.showComingSoonMessage) {
          var message = '';
          var isCustomMessage = false;
          var messageText = [];
          this.showAvailabilityMessage = true;

          if (data.showOutOfStockMessage) {
            if (data.outOfStockMessage) {
              // Show custom Out of Stock message
              message = data.outOfStockMessage;
              isCustomMessage = true;
            } else {
              // Show default Out of Stock message
              message = nike.exp.global.LocalValueUtil.getLocal('pdp.nostock.title');
            }

          } else if (data.showPreOrderMessage) {
            if (data.preOrderMessage) {
              // Show custom Pre-Order message
              message = data.preOrderMessage;
              isCustomMessage = true;
            } else {
              // Show default Pre-Order message
              message = nike.exp.global.LocalValueUtil.getLocal('pdp.preorder.message.title');
              messageText = [
                data.standardPreOrderMessage,
                nike.exp.global.LocalValueUtil.getLocal('pdp.preorder.messageTemplate.note')
              ];
            }

          } else if (data.showComingSoonMessage) {
            if (data.comingSoonMessage) {
              // Show custom Coming Soon Message
              message = data.comingSoonMessage;
              isCustomMessage = true;
            } else {
              // Show default Coming Soon Message
              message = nike.exp.global.LocalValueUtil.getLocal('buyingtools.comingSoon');
              messageText = [nike.exp.global.LocalValueUtil.getLocal('buyingtools.availableSoon')];
            }
          }
          data.availabilityMessage = this.addCSSClassesToH2(message);
          data.isCustomMessage = isCustomMessage;

          if (messageText.length) {
            data.availabilityMessageTexts = messageText;
          }
        }
      }
      this._super(data);
    },

    invalidateViewModel: function() {
      this._super();

      if (this.showAvailabilityMessage) {
        this.showMessage();
      }
    }
  });

})();

}catch(ex){
if(nike.error){
nike.error('An unhandled exception was thrown while executing nike.exp.pdp.desktop.AvailabilityMessaging. Make sure to look for previous errors because this might have failed as a result of another script failing', ex, 'Stack:', ex.stack, 'Message:', ex.message);
}
}

try{
var nike = nike || {};
nike.namespace("nike.exp.pdp.desktop.AddToCartMessaging");

nike.requireDependency('nike.exp.global.LocalValueUtil');
nike.requireDependency("nike.exp.pdp.desktop.PdpNotification");
nike.requireDependency("nike.exp.pdp.templates.desktop.PdpNotificationModule");

(function() {
  nike.exp.pdp.desktop.AddToCartMessaging = nike.exp.pdp.desktop.PdpNotification.extend({

    init: function() {
      this._super();
    },

    invalidateViewModel: function() {
      this._super();

      // Hide the notification if it's already showing a thanks message
      nike.listen(nike.Event.ADD_TO_CART, $.proxy(function(){
        if (this.cartMsg == true) {
          this.hideMessage();
          this.cartMsg = false;
        }
      }, this));
      
      // Show the Add to Cart message when necessary
      if (this.addToCartListener) {
        nike.unlisten(nike.Event.ADD_TO_CART_SUCCESS, this.addToCartListener);
      }
      this.addToCartListener = $.proxy(function(){
        var $addToCartSuccess = $('<div></div>')
          .addClass('nsg-font-family--base')
          .html(nike.exp.global.LocalValueUtil.getLocal('mini-PDP.addtocart.message'));
        this.addMessage($addToCartSuccess);
        this.cartMsg = true;
      }, this);
      nike.listen(nike.Event.ADD_TO_CART_SUCCESS, this.addToCartListener);
    }
  });

})();

}catch(ex){
if(nike.error){
nike.error('An unhandled exception was thrown while executing nike.exp.pdp.desktop.AddToCartMessaging. Make sure to look for previous errors because this might have failed as a result of another script failing', ex, 'Stack:', ex.stack, 'Message:', ex.message);
}
}

try{
var nike = nike || {};
nike.namespace("nike.exp.pdp.desktop.BrowseOnlyMessage");

nike.requireDependency("nike.exp.global.LocalValueUtil");
nike.requireDependency("nike.exp.pdp.desktop.PdpNotification");
nike.requireDependency("nike.exp.pdp.templates.desktop.PdpNotificationModule");

(function() {

  nike.exp.pdp.desktop.BrowseOnlyMessage = nike.exp.pdp.desktop.PdpNotification.extend({

    init: function() {
      this._super();
    },

    setViewModel: function(data) {
      this._super(data);

      if (!nike.FEATURE_LIST['BUYING_TOOLS_PDP'] && data && data.showBuyingTools) {
        var messageTitle = $('<div></div>')
          .addClass('exp-title nsg-font-family--platform-i')
          .html(nike.exp.global.LocalValueUtil.getLocal('minipdp.buyingtools.browseonly.title'));
        var messageBody = $('<p></p>')
          .html(nike.exp.global.LocalValueUtil.getLocal('minipdp.buyingtools.browseonly.note'));

        this.addMessage(messageTitle.add(messageBody));
      }
    }
  });

})();

}catch(ex){
if(nike.error){
nike.error('An unhandled exception was thrown while executing nike.exp.pdp.desktop.BrowseOnlyMessage. Make sure to look for previous errors because this might have failed as a result of another script failing', ex, 'Stack:', ex.stack, 'Message:', ex.message);
}
}
try{
var nike = nike || {};
if(nike.namespace){nike.namespace('nike.exp.pdp.templates.desktop.MiniPdpShell');}
   (function() { 
     var template = Handlebars.template, 
         templates = Handlebars.templates = Handlebars.templates || {}; 
     templates['MiniPdpShell'] = template({"1":function(container,depth0,helpers,partials,data) {
    return "loading";
},"3":function(container,depth0,helpers,partials,data) {
    return "    <div class=\"loading-image\">\n      <img src=\"/tesla/nikestore/html/img/loading_on_white.gif\" alt=\"Loading\">\n    </div>\n";
},"5":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "    <div class=\"mini-pdp-container\">\n\n      <div class=\"product-detail-container\">\n\n        "
    + alias3((helpers.viewModule || (depth0 && depth0.viewModule) || alias2).call(alias1,depth0,"nike.exp.pdp.desktop.ProductTitle","productTitle",{"name":"viewModule","hash":{},"data":data}))
    + "\n\n        "
    + alias3((helpers.viewModule || (depth0 && depth0.viewModule) || alias2).call(alias1,depth0,"nike.exp.pdp.desktop.ProductPrice","productPrice",{"name":"viewModule","hash":{},"data":data}))
    + "\n\n        "
    + alias3((helpers.viewModule || (depth0 && depth0.viewModule) || alias2).call(alias1,depth0,"nike.exp.pdp.desktop.LinkToPdp","linkToPdp",{"name":"viewModule","hash":{},"data":data}))
    + "\n\n        <div class=\"scroller-wrap\">\n          <div class=\"colorways-scroller\">\n            "
    + alias3((helpers.viewModule || (depth0 && depth0.viewModule) || alias2).call(alias1,depth0,"nike.exp.pdp.desktop.MiniPdpColorways","colorways",{"name":"viewModule","hash":{},"data":data}))
    + "\n          </div>\n        </div>\n\n        <div class=\"general-message\">\n          "
    + alias3((helpers.viewModule || (depth0 && depth0.viewModule) || alias2).call(alias1,depth0,"nike.exp.pdp.desktop.GeneralCustomMessage","generalMessage",{"name":"viewModule","hash":{},"data":data}))
    + "\n        </div>\n\n        <div class=\"availability-message\">\n          "
    + alias3((helpers.viewModule || (depth0 && depth0.viewModule) || alias2).call(alias1,depth0,"nike.exp.pdp.desktop.AvailabilityMessaging","availabilityMessage",{"name":"viewModule","hash":{},"data":data}))
    + "\n        </div>\n\n        "
    + alias3((helpers.viewModule || (depth0 && depth0.viewModule) || alias2).call(alias1,depth0,"nike.exp.pdp.desktop.BrowseOnlyMessage","browseOnlyMessage",{"name":"viewModule","hash":{},"data":data}))
    + "\n\n        <div class=\"add-to-cart-messaging\">\n          "
    + alias3((helpers.viewModule || (depth0 && depth0.viewModule) || alias2).call(alias1,depth0,"nike.exp.pdp.desktop.AddToCartMessaging","addToCartMessage",{"name":"viewModule","hash":{},"data":data}))
    + "\n        </div>\n\n"
    + ((stack1 = (helpers.featureFlag || (depth0 && depth0.featureFlag) || alias2).call(alias1,"BUYING_TOOLS_PDP",{"name":"featureFlag","hash":{},"fn":container.program(6, data, 0),"inverse":container.program(8, data, 0),"data":data})) != null ? stack1 : "")
    + "\n        <div class=\"vat-messaging\">\n          "
    + alias3((helpers.viewModule || (depth0 && depth0.viewModule) || alias2).call(alias1,depth0,"nike.exp.pdp.desktop.VatMessaging","vatMessage",{"name":"viewModule","hash":{},"data":data}))
    + "\n        </div>\n      </div>\n\n      <div class=\"hero-container\">\n        "
    + alias3((helpers.viewModule || (depth0 && depth0.viewModule) || alias2).call(alias1,depth0,"nike.exp.pdp.desktop.PreloadedAltHeroImage","preloadedAltHeroImage",{"name":"viewModule","hash":{},"data":data}))
    + "\n      </div>\n\n    </div>\n";
},"6":function(container,depth0,helpers,partials,data) {
    return "          "
    + container.escapeExpression((helpers.viewModule || (depth0 && depth0.viewModule) || helpers.helperMissing).call(depth0 != null ? depth0 : {},depth0,"nike.exp.pdp.desktop.BuyingTools","buyingTools",{"name":"viewModule","hash":{},"data":data}))
    + "\n";
},"8":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "          <div class=\"see-details-button-container\">\n            <button class=\"see-details-button js-pdp-redirect-button nsg-button nsg-grad--nike-orange\"  "
    + alias3((helpers.buildQaAttr || (depth0 && depth0.buildQaAttr) || alias2).call(alias1,"pdp.browse-only.see-details-button",{"name":"buildQaAttr","hash":{},"data":data}))
    + " data-url=\""
    + alias3(((helper = (helper = helpers.url || (depth0 != null ? depth0.url : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"url","hash":{},"data":data}) : helper)))
    + "\">\n              "
    + alias3((helpers.getLocal || (depth0 && depth0.getLocal) || alias2).call(alias1,"minipdp.details.button.text",{"name":"getLocal","hash":{},"data":data}))
    + "\n            </button>\n          </div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return alias3((helpers.requireDependency || (depth0 && depth0.requireDependency) || alias2).call(alias1,"nike.exp.pdp.desktop.MiniPdpShell",{"name":"requireDependency","hash":{},"data":data}))
    + "\n"
    + alias3((helpers.requireDependency || (depth0 && depth0.requireDependency) || alias2).call(alias1,"nike.exp.pdp.desktop.PreloadedAltHeroImage",{"name":"requireDependency","hash":{},"data":data}))
    + "\n"
    + alias3((helpers.requireDependency || (depth0 && depth0.requireDependency) || alias2).call(alias1,"nike.exp.pdp.desktop.ProductTitle",{"name":"requireDependency","hash":{},"data":data}))
    + "\n"
    + alias3((helpers.requireDependency || (depth0 && depth0.requireDependency) || alias2).call(alias1,"nike.exp.pdp.desktop.ProductPrice",{"name":"requireDependency","hash":{},"data":data}))
    + "\n"
    + alias3((helpers.requireDependency || (depth0 && depth0.requireDependency) || alias2).call(alias1,"nike.exp.pdp.desktop.MiniPdpColorways",{"name":"requireDependency","hash":{},"data":data}))
    + "\n"
    + alias3((helpers.requireDependency || (depth0 && depth0.requireDependency) || alias2).call(alias1,"nike.exp.pdp.desktop.PdpNotification",{"name":"requireDependency","hash":{},"data":data}))
    + "\n"
    + alias3((helpers.requireDependency || (depth0 && depth0.requireDependency) || alias2).call(alias1,"nike.exp.pdp.desktop.BuyingTools",{"name":"requireDependency","hash":{},"data":data}))
    + "\n"
    + alias3((helpers.requireDependency || (depth0 && depth0.requireDependency) || alias2).call(alias1,"nike.exp.pdp.desktop.LinkToPdp",{"name":"requireDependency","hash":{},"data":data}))
    + "\n"
    + alias3((helpers.requireDependency || (depth0 && depth0.requireDependency) || alias2).call(alias1,"nike.exp.pdp.desktop.VatMessaging",{"name":"requireDependency","hash":{},"data":data}))
    + "\n"
    + alias3((helpers.requireDependency || (depth0 && depth0.requireDependency) || alias2).call(alias1,"nike.exp.pdp.desktop.AvailabilityMessaging",{"name":"requireDependency","hash":{},"data":data}))
    + "\n"
    + alias3((helpers.requireDependency || (depth0 && depth0.requireDependency) || alias2).call(alias1,"nike.exp.pdp.desktop.AddToCartMessaging",{"name":"requireDependency","hash":{},"data":data}))
    + "\n"
    + alias3((helpers.requireDependency || (depth0 && depth0.requireDependency) || alias2).call(alias1,"nike.exp.pdp.desktop.BrowseOnlyMessage",{"name":"requireDependency","hash":{},"data":data}))
    + "\n"
    + alias3((helpers.requireDependency || (depth0 && depth0.requireDependency) || alias2).call(alias1,"nike.exp.global.TemplateHelpers",{"name":"requireDependency","hash":{},"data":data}))
    + "\n\n<section class=\"mini-pdp-content "
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.productId : depth0),{"name":"unless","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\">\n\n"
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.productId : depth0),{"name":"unless","hash":{},"fn":container.program(3, data, 0),"inverse":container.program(5, data, 0),"data":data})) != null ? stack1 : "")
    + "</section>\n";
},"useData":true}); 
   })();
}catch(ex){
if(nike.error){
nike.error('An unhandled exception was thrown while executing nike.exp.pdp.templates.desktop.MiniPdpShell. Make sure to look for previous errors because this might have failed as a result of another script failing', ex, 'Stack:', ex.stack, 'Message:', ex.message);
}
}

try{
var nike = nike || {};
nike.namespace("nike.exp.pdp.desktop.GeneralCustomMessage");

nike.requireDependency("nike.exp.global.LocalValueUtil");
nike.requireDependency("nike.exp.pdp.desktop.PdpNotification");
nike.requireDependency("nike.exp.pdp.templates.desktop.PdpNotificationModule");

(function() {

  nike.exp.pdp.desktop.GeneralCustomMessage = nike.exp.pdp.desktop.PdpNotification.extend({

    init: function() {
      this._super();
    },

    invalidateViewModel: function() {
      this._super();

      // Show the always visible general custom message if available
      if (this.viewModel && this.viewModel.colorwayGeneralMessage) {
        var message = this.addCSSClassesToH2(this.viewModel.colorwayGeneralMessage);

        this.addMessage(message);
      }
    }
  });

})();

}catch(ex){
if(nike.error){
nike.error('An unhandled exception was thrown while executing nike.exp.pdp.desktop.GeneralCustomMessage. Make sure to look for previous errors because this might have failed as a result of another script failing', ex, 'Stack:', ex.stack, 'Message:', ex.message);
}
}


try{
var nike = nike || {};
nike.namespace('nike.exp.pdp.base.BasePdpService', function(){

  nike.requireDependency('jQuery');
  var SiteIdUtil = nike.requireDependency('nike.SiteIdUtil');
  var BooleanUtil = nike.requireDependency('nike.util.BooleanUtil');

  return {
    ACTION: null,
    SERVICE_NAME: null,

    /**
     * Returns new data for the mini pdp.
     *
     * @param request Contains request data. See notes below on format.
     *
     * @notes pdpRequest should be formatted as follows:
     * {
     *   path: 'pd/zoom-hyperdisruptor-basketball-shoe',
     *   productId: '655659',
     *   prodcutGroupId: '655660'
     * }
     *
     * @returns {Promise}
     */
    requestPdpData: function(request){
      var deferred = $.Deferred();

      // Add language and locale to the request.
      request = $.extend(request, {
        action: this.ACTION,
        country: nike.COUNTRY,
        'lang_locale': nike.LOCALE
      });

      // Get the service url and make sure it has been defined.
      var serviceUrl = nike.getServiceUrl(this.SERVICE_NAME);
      if( typeof(serviceUrl) !== 'string' ) {
        var msg = this.SERVICE_NAME + ' is undefined. Make sure it has been ' +
                  'included in nike.SERVICE_URLS.';
        nike.error(msg);
        throw new Error(msg);
      }

      // Make the ajax request. The Success and Error callbacks are wrapped by internal functions.
      nike.request({
        method: 'GET',
        url: serviceUrl,
        data: request
      }, $.proxy(function(response){
        var data = $.parseJSON(response.data);
        if (!BooleanUtil.getBoolean(data.success, false)){
          deferred.reject(data);
        }else{
          // Try and get the site id and update the response.
          SiteIdUtil.getDefaultSiteId(function(siteId){
            if(nike.objectDefined('response.pdpData', data) && siteId) {
              data.response.pdpData.siteId = siteId;
            }

            // Limit quantity drop down to 6 if user is a Swoosh User
            var cookie = nike.Cart.getCartSummaryFromCookie();
            if (cookie && cookie.userType === nike.Cart.UserType.EMPLOYEE){
              data.response.pdpData.quantityLimit = 6;
            }

            data.response.pdpData = nike.exp.pdp.base.BasePdpService.addSingleColorwayArray(data.response.pdpData);

            deferred.resolve(data.response.pdpData);
          });
        }
      }, this), function(error){
        deferred.reject(error);
      });

      return deferred.promise();
    },

    /**
     * Deconstruct URL to grab pdp data to display in template.
     * @param {String} link - Valid url for an inline pdp
     */
    parseLinkForRequestData : function(link){

      // Using link saved so data link becomes optional
      var pidReg = /pid-(\d*)/;
      var pgidReg = /pgid-(\d*)/;
      var pdpRequestArgs = {};

      try{
        var pidMatch = link.match(pidReg);
        var pgidMatch = link.match(pgidReg);
        var productId = pidMatch[1];
        // pgid is optional
        var productGroupId = null;
        if (pgidMatch) {
          productGroupId = pgidMatch[1];
        }

        pdpRequestArgs = {
          path : nike.util.UrlUtil.getPath(link),
          productId : productId
        };

        // Only add productGroupId if it's not null
        if (productGroupId) {
          pdpRequestArgs.productGroupId = productGroupId;
        }
      } catch (e){
        nike.error('There was a problem trying to parse the link for request data', e);
      }

      return pdpRequestArgs;
    },

    addSingleColorwayArray : function(data){
      if (data) {

        data.inStockColorways = data.inStockColorways || [];
        data.preOrderColorways = data.preOrderColorways || [];
        data.comingSoonColorways = data.comingSoonColorways || [];
        data.outOfStockColorways = data.outOfStockColorways || [];

        // Create an index of colorways by type that should be included
        var colorwaysByClass = {
          'in-stock': data.inStockColorways,
          'pre-order': data.preOrderColorways,
          'coming-soon': data.comingSoonColorways,
          'out-of-stock': data.outOfStockColorways
        };

        var allColorways = [];
        var currentColorwayIndex = 0;
        // Loop over all the colorways and create a new array to hold all the colorways.
        // Each colorway will have a 'stockType' property to indicate 'in stock', 'pre order' etc.
        _(colorwaysByClass).each(function(colorways, classKey){
          _(colorways).each(function(colorway){
            _(colorway).extend({stockType: classKey});
            allColorways.push(colorway);
            if (colorway.productId === data.productId) {
              currentColorwayIndex = allColorways.length - 1;
            }
          });
        });
        data.allColorways = allColorways;
        data.colorwaysLength = data.allColorways.length;
        data.currentColorwayIndex = currentColorwayIndex;

      }

      return data;
    }

  };
});

}catch(ex){
if(nike.error){
nike.error('An unhandled exception was thrown while executing nike.exp.pdp.base.BasePdpService. Make sure to look for previous errors because this might have failed as a result of another script failing', ex, 'Stack:', ex.stack, 'Message:', ex.message);
}
}
try{
var nike = nike || {};
// @author gballi
// @notes refactored 2013-12-11

nike.namespace('nike.exp.pdp.base.MiniPdpService');

nike.requireDependency('lib.lodash');
nike.requireDependency('nike.exp.pdp.base.BasePdpService');

nike.exp.pdp.base.MiniPdpService = _.extend(nike.exp.pdp.base.BasePdpService, {
  ACTION: 'getMiniPdpPageDataModel',  // only one action is ever used
  SERVICE_NAME: 'miniPdpDataService' // service to look up
});

}catch(ex){
if(nike.error){
nike.error('An unhandled exception was thrown while executing nike.exp.pdp.base.MiniPdpService. Make sure to look for previous errors because this might have failed as a result of another script failing', ex, 'Stack:', ex.stack, 'Message:', ex.message);
}
}
try{
var nike = nike || {};
nike.namespace('nike.exp.pdp.Event');

nike.Event = $.extend(nike.Event, {
  MINI_PDP_OPEN: 'miniPdpEvent',  // Dispatched when the modal is requested, but before pdp data is loaded
  MINI_PDP_DATA_LOADED: 'miniPdpDataLoaded',   // Dispatched after pdp data is returned
  MINI_PDP_VIEW_INLINE_PDP: 'miniPdpViewInlinePdp',
  DIGITALPID_CLEAR_FIELDS: 'digitalPidClearFields',
  DIGITALPID_MAX_CAPACITY: 'digitalPidMaxCapacity',
  DIGITALPID_HELP_LINK: 'digitalPidHelpLink',
  DIGITALPID_MOBILE_CTA: 'digitalPidMobileCTA',
  DIGITALPID_MOBILE_CANCEL: 'digitalPidMobileCancel'
});

}catch(ex){
if(nike.error){
nike.error('An unhandled exception was thrown while executing nike.exp.pdp.Event. Make sure to look for previous errors because this might have failed as a result of another script failing', ex, 'Stack:', ex.stack, 'Message:', ex.message);
}
}
try{
var nike = nike || {};

/*********************************************************************************************************************
** DEPRECATED: Please use Hammer.js for all future touch related functionality
*********************************************************************************************************************/

nike.namespace('nike.Iscroll');

/*! iScroll v5.1.2 ~ (c) 2008-2014 Matteo Spinelli ~ http://cubiq.org/license */
(function (window, document, Math) {
  var rAF = window.requestAnimationFrame	||
            window.webkitRequestAnimationFrame	||
            window.mozRequestAnimationFrame		||
            window.oRequestAnimationFrame		||
            window.msRequestAnimationFrame		||
            function (callback) { window.setTimeout(callback, 1000 / 60); };

  var utils = (function () {
    var me = {};

    var _elementStyle = document.createElement('div').style;
    var _vendor = (function () {
      var vendors = ['t', 'webkitT', 'MozT', 'msT', 'OT'],
      transform,
      i = 0,
      l = vendors.length;

      for ( ; i < l; i++ ) {
        transform = vendors[i] + 'ransform';
        if ( transform in _elementStyle ) return vendors[i].substr(0, vendors[i].length-1);
      }

      return false;
    })();

    function _prefixStyle (style) {
      if ( _vendor === false ) return false;
      if ( _vendor === '' ) return style;
      return _vendor + style.charAt(0).toUpperCase() + style.substr(1);
    }

    me.getTime = Date.now || function getTime () { return new Date().getTime(); };

    me.extend = function (target, obj) {
      for ( var i in obj ) {
        target[i] = obj[i];
      }
    };

    me.addEvent = function (el, type, fn, capture) {
      el.addEventListener(type, fn, !!capture);
    };

    me.removeEvent = function (el, type, fn, capture) {
      el.removeEventListener(type, fn, !!capture);
    };

    me.prefixPointerEvent = function (pointerEvent) {
      return window.MSPointerEvent ?
             'MSPointer' + pointerEvent.charAt(9).toUpperCase() + pointerEvent.substr(10):
             pointerEvent;
    };

    me.momentum = function (current, start, time, lowerMargin, wrapperSize, deceleration) {
      var distance = current - start,
      speed = Math.abs(distance) / time,
      destination,
      duration;

      deceleration = deceleration === undefined ? 0.0006 : deceleration;

      destination = current + ( speed * speed ) / ( 2 * deceleration ) * ( distance < 0 ? -1 : 1 );
      duration = speed / deceleration;

      if ( destination < lowerMargin ) {
        destination = wrapperSize ? lowerMargin - ( wrapperSize / 2.5 * ( speed / 8 ) ) : lowerMargin;
        distance = Math.abs(destination - current);
        duration = distance / speed;
      } else if ( destination > 0 ) {
        destination = wrapperSize ? wrapperSize / 2.5 * ( speed / 8 ) : 0;
        distance = Math.abs(current) + destination;
        duration = distance / speed;
      }

      return {
        destination: Math.round(destination),
        duration: duration
      };
    };

    var _transform = _prefixStyle('transform');

    me.extend(me, {
      hasTransform: _transform !== false,
      hasPerspective: _prefixStyle('perspective') in _elementStyle,
      hasTouch: 'ontouchstart' in window,
      hasPointer: window.PointerEvent || window.MSPointerEvent, // IE10 is prefixed
      hasTransition: _prefixStyle('transition') in _elementStyle
    });

    // This should find all Android browsers lower than build 535.19 (both stock browser and webview)
    me.isBadAndroid = /Android /.test(window.navigator.appVersion) && !(/Chrome\/\d/.test(window.navigator.appVersion));

    me.extend(me.style = {}, {
      transform: _transform,
      transitionTimingFunction: _prefixStyle('transitionTimingFunction'),
      transitionDuration: _prefixStyle('transitionDuration'),
      transitionDelay: _prefixStyle('transitionDelay'),
      transformOrigin: _prefixStyle('transformOrigin')
    });

    me.hasClass = function (e, c) {
      var re = new RegExp("(^|\\s)" + c + "(\\s|$)");
      return re.test(e.className);
    };

    me.addClass = function (e, c) {
      if ( me.hasClass(e, c) ) {
        return;
      }

      var newclass = e.className.split(' ');
      newclass.push(c);
      e.className = newclass.join(' ');
    };

    me.removeClass = function (e, c) {
      if ( !me.hasClass(e, c) ) {
        return;
      }

      var re = new RegExp("(^|\\s)" + c + "(\\s|$)", 'g');
      e.className = e.className.replace(re, ' ');
    };

    me.offset = function (el) {
      var left = -el.offsetLeft,
      top = -el.offsetTop;

      // jshint -W084
      while (el = el.offsetParent) {
        left -= el.offsetLeft;
        top -= el.offsetTop;
      }
      // jshint +W084

      return {
        left: left,
        top: top
      };
    };

    me.preventDefaultException = function (el, exceptions) {
      for ( var i in exceptions ) {
        if ( exceptions[i].test(el[i]) ) {
          return true;
        }
      }

      return false;
    };

    me.extend(me.eventType = {}, {
      touchstart: 1,
      touchmove: 1,
      touchend: 1,

      mousedown: 2,
      mousemove: 2,
      mouseup: 2,

      pointerdown: 3,
      pointermove: 3,
      pointerup: 3,

      MSPointerDown: 3,
      MSPointerMove: 3,
      MSPointerUp: 3
    });

    me.extend(me.ease = {}, {
      quadratic: {
        style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        fn: function (k) {
          return k * ( 2 - k );
        }
      },
      circular: {
        style: 'cubic-bezier(0.1, 0.57, 0.1, 1)',	// Not properly "circular" but this looks better, it should be (0.075, 0.82, 0.165, 1)
        fn: function (k) {
          return Math.sqrt( 1 - ( --k * k ) );
        }
      },
      back: {
        style: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        fn: function (k) {
          var b = 4;
          return ( k = k - 1 ) * k * ( ( b + 1 ) * k + b ) + 1;
        }
      },
      bounce: {
        style: '',
        fn: function (k) {
          if ( ( k /= 1 ) < ( 1 / 2.75 ) ) {
            return 7.5625 * k * k;
          } else if ( k < ( 2 / 2.75 ) ) {
            return 7.5625 * ( k -= ( 1.5 / 2.75 ) ) * k + 0.75;
          } else if ( k < ( 2.5 / 2.75 ) ) {
            return 7.5625 * ( k -= ( 2.25 / 2.75 ) ) * k + 0.9375;
          } else {
            return 7.5625 * ( k -= ( 2.625 / 2.75 ) ) * k + 0.984375;
          }
        }
      },
      elastic: {
        style: '',
        fn: function (k) {
          var f = 0.22,
          e = 0.4;

          if ( k === 0 ) { return 0; }
          if ( k == 1 ) { return 1; }

          return ( e * Math.pow( 2, - 10 * k ) * Math.sin( ( k - f / 4 ) * ( 2 * Math.PI ) / f ) + 1 );
        }
      }
    });

    me.tap = function (e, eventName) {
      var ev = document.createEvent('Event');
      ev.initEvent(eventName, true, true);
      ev.pageX = e.pageX;
      ev.pageY = e.pageY;
      e.target.dispatchEvent(ev);
    };

    me.click = function (e) {
      var target = e.target,
      ev;

      if ( !(/(SELECT|INPUT|TEXTAREA)/i).test(target.tagName) ) {
        ev = document.createEvent('MouseEvents');
        ev.initMouseEvent('click', true, true, e.view, 1,
        target.screenX, target.screenY, target.clientX, target.clientY,
        e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
        0, null);

        ev._constructed = true;
        target.dispatchEvent(ev);
      }
    };

    return me;
  })();

  function IScroll (el, options) {
    this.wrapper = typeof el == 'string' ? document.querySelector(el) : el;
    this.scroller = this.wrapper.children[0];
    this.scrollerStyle = this.scroller.style;		// cache style for better performance

    this.options = {

      resizeScrollbars: true,

      mouseWheelSpeed: 20,

      snapThreshold: 0.334,

// INSERT POINT: OPTIONS

      startX: 0,
      startY: 0,
      scrollY: true,
      directionLockThreshold: 5,
      momentum: true,

      bounce: true,
      bounceTime: 600,
      bounceEasing: '',

      preventDefault: true,
      preventDefaultException: { tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/ },

      HWCompositing: true,
      useTransition: true,
      useTransform: true
    };

    for ( var i in options ) {
      this.options[i] = options[i];
    }

    // Normalize options
    this.translateZ = this.options.HWCompositing && utils.hasPerspective ? ' translateZ(0)' : '';

    this.options.useTransition = utils.hasTransition && this.options.useTransition;
    this.options.useTransform = utils.hasTransform && this.options.useTransform;

    this.options.eventPassthrough = this.options.eventPassthrough === true ? 'vertical' : this.options.eventPassthrough;
    this.options.preventDefault = !this.options.eventPassthrough && this.options.preventDefault;

    // If you want eventPassthrough I have to lock one of the axes
    this.options.scrollY = this.options.eventPassthrough == 'vertical' ? false : this.options.scrollY;
    this.options.scrollX = this.options.eventPassthrough == 'horizontal' ? false : this.options.scrollX;

    // With eventPassthrough we also need lockDirection mechanism
    this.options.freeScroll = this.options.freeScroll && !this.options.eventPassthrough;
    this.options.directionLockThreshold = this.options.eventPassthrough ? 0 : this.options.directionLockThreshold;

    this.options.bounceEasing = typeof this.options.bounceEasing == 'string' ? utils.ease[this.options.bounceEasing] || utils.ease.circular : this.options.bounceEasing;

    this.options.resizePolling = this.options.resizePolling === undefined ? 60 : this.options.resizePolling;

    if ( this.options.tap === true ) {
      this.options.tap = 'tap';
    }

    if ( this.options.shrinkScrollbars == 'scale' ) {
      this.options.useTransition = false;
    }

    this.options.invertWheelDirection = this.options.invertWheelDirection ? -1 : 1;

// INSERT POINT: NORMALIZATION

    // Some defaults
    this.x = 0;
    this.y = 0;
    this.directionX = 0;
    this.directionY = 0;
    this._events = {};

// INSERT POINT: DEFAULTS

    this._init();
    this.refresh();

    this.scrollTo(this.options.startX, this.options.startY);
    this.enable();
  }

  IScroll.prototype = {
    version: '5.1.2',

    _init: function () {
      this._initEvents();

      if ( this.options.scrollbars || this.options.indicators ) {
        this._initIndicators();
      }

      if ( this.options.mouseWheel ) {
        this._initWheel();
      }

      if ( this.options.snap ) {
        this._initSnap();
      }

      if ( this.options.keyBindings ) {
        this._initKeys();
      }

// INSERT POINT: _init

    },

    destroy: function () {
      this._initEvents(true);

      this._execEvent('destroy');
    },

    _transitionEnd: function (e) {
      if ( e.target != this.scroller || !this.isInTransition ) {
        return;
      }

      this._transitionTime();
      if ( !this.resetPosition(this.options.bounceTime) ) {
        this.isInTransition = false;
        this._execEvent('scrollEnd');
      }
    },

    _start: function (e) {
      // React to left mouse button only
      if ( utils.eventType[e.type] != 1 ) {
        if ( e.button !== 0 ) {
          return;
        }
      }

      if ( !this.enabled || (this.initiated && utils.eventType[e.type] !== this.initiated) ) {
        return;
      }

      if ( this.options.preventDefault && !utils.isBadAndroid && !utils.preventDefaultException(e.target, this.options.preventDefaultException) ) {
        e.preventDefault();
      }

      var point = e.touches ? e.touches[0] : e,
      pos;

      this.initiated	= utils.eventType[e.type];
      this.moved		= false;
      this.distX		= 0;
      this.distY		= 0;
      this.directionX = 0;
      this.directionY = 0;
      this.directionLocked = 0;

      this._transitionTime();

      this.startTime = utils.getTime();

      if ( this.options.useTransition && this.isInTransition ) {
        this.isInTransition = false;
        pos = this.getComputedPosition();
        this._translate(Math.round(pos.x), Math.round(pos.y));
        this._execEvent('scrollEnd');
      } else if ( !this.options.useTransition && this.isAnimating ) {
        this.isAnimating = false;
        this._execEvent('scrollEnd');
      }

      this.startX    = this.x;
      this.startY    = this.y;
      this.absStartX = this.x;
      this.absStartY = this.y;
      this.pointX    = point.pageX;
      this.pointY    = point.pageY;

      this._execEvent('beforeScrollStart');
    },

    _move: function (e) {
      if ( !this.enabled || utils.eventType[e.type] !== this.initiated ) {
        return;
      }

      if ( this.options.preventDefault ) {	// increases performance on Android? TODO: check!
        e.preventDefault();
      }

      var point		= e.touches ? e.touches[0] : e,
      deltaX		= point.pageX - this.pointX,
      deltaY		= point.pageY - this.pointY,
      timestamp	= utils.getTime(),
      newX, newY,
      absDistX, absDistY;

      this.pointX		= point.pageX;
      this.pointY		= point.pageY;

      this.distX		+= deltaX;
      this.distY		+= deltaY;
      absDistX		= Math.abs(this.distX);
      absDistY		= Math.abs(this.distY);

      // We need to move at least 10 pixels for the scrolling to initiate
      if ( timestamp - this.endTime > 300 && (absDistX < 10 && absDistY < 10) ) {
        return;
      }

      // If you are scrolling in one direction lock the other
      if ( !this.directionLocked && !this.options.freeScroll ) {
        if ( absDistX > absDistY + this.options.directionLockThreshold ) {
          this.directionLocked = 'h';		// lock horizontally
        } else if ( absDistY >= absDistX + this.options.directionLockThreshold ) {
          this.directionLocked = 'v';		// lock vertically
        } else {
          this.directionLocked = 'n';		// no lock
        }
      }

      if ( this.directionLocked == 'h' ) {
        if ( this.options.eventPassthrough == 'vertical' ) {
          e.preventDefault();
        } else if ( this.options.eventPassthrough == 'horizontal' ) {
          this.initiated = false;
          return;
        }

        deltaY = 0;
      } else if ( this.directionLocked == 'v' ) {
        if ( this.options.eventPassthrough == 'horizontal' ) {
          e.preventDefault();
        } else if ( this.options.eventPassthrough == 'vertical' ) {
          this.initiated = false;
          return;
        }

        deltaX = 0;
      }

      deltaX = this.hasHorizontalScroll ? deltaX : 0;
      deltaY = this.hasVerticalScroll ? deltaY : 0;

      newX = this.x + deltaX;
      newY = this.y + deltaY;

      // Slow down if outside of the boundaries
      if ( newX > 0 || newX < this.maxScrollX ) {
        newX = this.options.bounce ? this.x + deltaX / 3 : newX > 0 ? 0 : this.maxScrollX;
      }
      if ( newY > 0 || newY < this.maxScrollY ) {
        newY = this.options.bounce ? this.y + deltaY / 3 : newY > 0 ? 0 : this.maxScrollY;
      }

      this.directionX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
      this.directionY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;

      if ( !this.moved ) {
        this._execEvent('scrollStart');
      }

      this.moved = true;

      this._translate(newX, newY);

      /* REPLACE START: _move */

      if ( timestamp - this.startTime > 300 ) {
        this.startTime = timestamp;
        this.startX = this.x;
        this.startY = this.y;
      }

      /* REPLACE END: _move */

    },

    _end: function (e) {
      if ( !this.enabled || utils.eventType[e.type] !== this.initiated ) {
        return;
      }

      if ( this.options.preventDefault && !utils.preventDefaultException(e.target, this.options.preventDefaultException) ) {
        e.preventDefault();
      }

      var point = e.changedTouches ? e.changedTouches[0] : e,
      momentumX,
      momentumY,
      duration = utils.getTime() - this.startTime,
      newX = Math.round(this.x),
      newY = Math.round(this.y),
      distanceX = Math.abs(newX - this.startX),
      distanceY = Math.abs(newY - this.startY),
      time = 0,
      easing = '';

      this.isInTransition = 0;
      this.initiated = 0;
      this.endTime = utils.getTime();

      // reset if we are outside of the boundaries
      if ( this.resetPosition(this.options.bounceTime) ) {
        return;
      }

      this.scrollTo(newX, newY);	// ensures that the last position is rounded

      // we scrolled less than 10 pixels
      if ( !this.moved ) {
        if ( this.options.tap ) {
          utils.tap(e, this.options.tap);
        }

        if ( this.options.click ) {
          utils.click(e);
        }

        this._execEvent('scrollCancel');
        return;
      }

      if ( this._events.flick && duration < 200 && distanceX < 100 && distanceY < 100 ) {
        this._execEvent('flick');
        return;
      }

      // start momentum animation if needed
      if ( this.options.momentum && duration < 300 ) {
        momentumX = this.hasHorizontalScroll ? utils.momentum(this.x, this.startX, duration, this.maxScrollX, this.options.bounce ? this.wrapperWidth : 0, this.options.deceleration) : { destination: newX, duration: 0 };
        momentumY = this.hasVerticalScroll ? utils.momentum(this.y, this.startY, duration, this.maxScrollY, this.options.bounce ? this.wrapperHeight : 0, this.options.deceleration) : { destination: newY, duration: 0 };
        newX = momentumX.destination;
        newY = momentumY.destination;
        time = Math.max(momentumX.duration, momentumY.duration);
        this.isInTransition = 1;
      }


      if ( this.options.snap ) {
        var snap = this._nearestSnap(newX, newY);
        this.currentPage = snap;
        time = this.options.snapSpeed || Math.max(
        Math.max(
        Math.min(Math.abs(newX - snap.x), 1000),
        Math.min(Math.abs(newY - snap.y), 1000)
        ), 300);
        newX = snap.x;
        newY = snap.y;

        this.directionX = 0;
        this.directionY = 0;
        easing = this.options.bounceEasing;
      }

// INSERT POINT: _end

      if ( newX != this.x || newY != this.y ) {
        // change easing function when scroller goes out of the boundaries
        if ( newX > 0 || newX < this.maxScrollX || newY > 0 || newY < this.maxScrollY ) {
          easing = utils.ease.quadratic;
        }

        this.scrollTo(newX, newY, time, easing);
        return;
      }

      this._execEvent('scrollEnd');
    },

    _resize: function () {
      var that = this;

      clearTimeout(this.resizeTimeout);

      this.resizeTimeout = setTimeout(function () {
        that.refresh();
      }, this.options.resizePolling);
    },

    resetPosition: function (time) {
      var x = this.x,
      y = this.y;

      time = time || 0;

      if ( !this.hasHorizontalScroll || this.x > 0 ) {
        x = 0;
      } else if ( this.x < this.maxScrollX ) {
        x = this.maxScrollX;
      }

      if ( !this.hasVerticalScroll || this.y > 0 ) {
        y = 0;
      } else if ( this.y < this.maxScrollY ) {
        y = this.maxScrollY;
      }

      if ( x == this.x && y == this.y ) {
        return false;
      }

      this.scrollTo(x, y, time, this.options.bounceEasing);

      return true;
    },

    disable: function () {
      this.enabled = false;
    },

    enable: function () {
      this.enabled = true;
    },

    refresh: function () {
      var rf = this.wrapper.offsetHeight;		// Force reflow

      this.wrapperWidth	= this.wrapper.clientWidth;
      this.wrapperHeight	= this.wrapper.clientHeight;

      /* REPLACE START: refresh */

      this.scrollerWidth	= this.scroller.offsetWidth;
      this.scrollerHeight	= this.scroller.offsetHeight;

      this.maxScrollX		= this.wrapperWidth - this.scrollerWidth;
      this.maxScrollY		= this.wrapperHeight - this.scrollerHeight;

      /* REPLACE END: refresh */

      this.hasHorizontalScroll	= this.options.scrollX && this.maxScrollX < 0;
      this.hasVerticalScroll		= this.options.scrollY && this.maxScrollY < 0;

      if ( !this.hasHorizontalScroll ) {
        this.maxScrollX = 0;
        this.scrollerWidth = this.wrapperWidth;
      }

      if ( !this.hasVerticalScroll ) {
        this.maxScrollY = 0;
        this.scrollerHeight = this.wrapperHeight;
      }

      this.endTime = 0;
      this.directionX = 0;
      this.directionY = 0;

      this.wrapperOffset = utils.offset(this.wrapper);

      this._execEvent('refresh');

      this.resetPosition();

// INSERT POINT: _refresh

    },

    on: function (type, fn) {
      if ( !this._events[type] ) {
        this._events[type] = [];
      }

      this._events[type].push(fn);
    },

    off: function (type, fn) {
      if ( !this._events[type] ) {
        return;
      }

      var index = this._events[type].indexOf(fn);

      if ( index > -1 ) {
        this._events[type].splice(index, 1);
      }
    },

    _execEvent: function (type) {
      if ( !this._events[type] ) {
        return;
      }

      var i = 0,
      l = this._events[type].length;

      if ( !l ) {
        return;
      }

      for ( ; i < l; i++ ) {
        this._events[type][i].apply(this, [].slice.call(arguments, 1));
      }
    },

    scrollBy: function (x, y, time, easing) {
      x = this.x + x;
      y = this.y + y;
      time = time || 0;

      this.scrollTo(x, y, time, easing);
    },

    scrollTo: function (x, y, time, easing) {
      easing = easing || utils.ease.circular;

      this.isInTransition = this.options.useTransition && time > 0;

      if ( !time || (this.options.useTransition && easing.style) ) {
        this._transitionTimingFunction(easing.style);
        this._transitionTime(time);
        this._translate(x, y);
      } else {
        this._animate(x, y, time, easing.fn);
      }
    },

    scrollToElement: function (el, time, offsetX, offsetY, easing) {
      el = el.nodeType ? el : this.scroller.querySelector(el);

      if ( !el ) {
        return;
      }

      var pos = utils.offset(el);

      pos.left -= this.wrapperOffset.left;
      pos.top  -= this.wrapperOffset.top;

      // if offsetX/Y are true we center the element to the screen
      if ( offsetX === true ) {
        offsetX = Math.round(el.offsetWidth / 2 - this.wrapper.offsetWidth / 2);
      }
      if ( offsetY === true ) {
        offsetY = Math.round(el.offsetHeight / 2 - this.wrapper.offsetHeight / 2);
      }

      pos.left -= offsetX || 0;
      pos.top  -= offsetY || 0;

      pos.left = pos.left > 0 ? 0 : pos.left < this.maxScrollX ? this.maxScrollX : pos.left;
      pos.top  = pos.top  > 0 ? 0 : pos.top  < this.maxScrollY ? this.maxScrollY : pos.top;

      time = time === undefined || time === null || time === 'auto' ? Math.max(Math.abs(this.x-pos.left), Math.abs(this.y-pos.top)) : time;

      this.scrollTo(pos.left, pos.top, time, easing);
    },

    _transitionTime: function (time) {
      time = time || 0;

      this.scrollerStyle[utils.style.transitionDuration] = time + 'ms';

      if ( !time && utils.isBadAndroid ) {
        this.scrollerStyle[utils.style.transitionDuration] = '0.001s';
      }


      if ( this.indicators ) {
        for ( var i = this.indicators.length; i--; ) {
          this.indicators[i].transitionTime(time);
        }
      }


// INSERT POINT: _transitionTime

    },

    _transitionTimingFunction: function (easing) {
      this.scrollerStyle[utils.style.transitionTimingFunction] = easing;


      if ( this.indicators ) {
        for ( var i = this.indicators.length; i--; ) {
          this.indicators[i].transitionTimingFunction(easing);
        }
      }


// INSERT POINT: _transitionTimingFunction

    },

    _translate: function (x, y) {
      if ( this.options.useTransform ) {

        /* REPLACE START: _translate */

        this.scrollerStyle[utils.style.transform] = 'translate(' + x + 'px,' + y + 'px)' + this.translateZ;

        /* REPLACE END: _translate */

      } else {
        x = Math.round(x);
        y = Math.round(y);
        this.scrollerStyle.left = x + 'px';
        this.scrollerStyle.top = y + 'px';
      }

      this.x = x;
      this.y = y;


      if ( this.indicators ) {
        for ( var i = this.indicators.length; i--; ) {
          this.indicators[i].updatePosition();
        }
      }


// INSERT POINT: _translate

    },

    _initEvents: function (remove) {
      var eventType = remove ? utils.removeEvent : utils.addEvent,
      target = this.options.bindToWrapper ? this.wrapper : window;

      eventType(window, 'orientationchange', this);
      eventType(window, 'resize', this);

      if ( this.options.click ) {
        eventType(this.wrapper, 'click', this, true);
      }

      if ( !this.options.disableMouse ) {
        eventType(this.wrapper, 'mousedown', this);
        eventType(target, 'mousemove', this);
        eventType(target, 'mousecancel', this);
        eventType(target, 'mouseup', this);
      }

      if ( utils.hasPointer && !this.options.disablePointer ) {
        eventType(this.wrapper, utils.prefixPointerEvent('pointerdown'), this);
        eventType(target, utils.prefixPointerEvent('pointermove'), this);
        eventType(target, utils.prefixPointerEvent('pointercancel'), this);
        eventType(target, utils.prefixPointerEvent('pointerup'), this);
      }

      if ( utils.hasTouch && !this.options.disableTouch ) {
        eventType(this.wrapper, 'touchstart', this);
        eventType(target, 'touchmove', this);
        eventType(target, 'touchcancel', this);
        eventType(target, 'touchend', this);
      }

      eventType(this.scroller, 'transitionend', this);
      eventType(this.scroller, 'webkitTransitionEnd', this);
      eventType(this.scroller, 'oTransitionEnd', this);
      eventType(this.scroller, 'MSTransitionEnd', this);
    },

    getComputedPosition: function () {
      var matrix = window.getComputedStyle(this.scroller, null),
      x, y;

      if ( this.options.useTransform ) {
        matrix = matrix[utils.style.transform].split(')')[0].split(', ');
        x = +(matrix[12] || matrix[4]);
        y = +(matrix[13] || matrix[5]);
      } else {
        x = +matrix.left.replace(/[^-\d.]/g, '');
        y = +matrix.top.replace(/[^-\d.]/g, '');
      }

      return { x: x, y: y };
    },

    _initIndicators: function () {
      var interactive = this.options.interactiveScrollbars,
      customStyle = typeof this.options.scrollbars != 'string',
      indicators = [],
      indicator;

      var that = this;

      this.indicators = [];

      if ( this.options.scrollbars ) {
        // Vertical scrollbar
        if ( this.options.scrollY ) {
          indicator = {
            el: createDefaultScrollbar('v', interactive, this.options.scrollbars),
            interactive: interactive,
            defaultScrollbars: true,
            customStyle: customStyle,
            resize: this.options.resizeScrollbars,
            shrink: this.options.shrinkScrollbars,
            fade: this.options.fadeScrollbars,
            listenX: false
          };

          this.wrapper.appendChild(indicator.el);
          indicators.push(indicator);
        }

        // Horizontal scrollbar
        if ( this.options.scrollX ) {
          indicator = {
            el: createDefaultScrollbar('h', interactive, this.options.scrollbars),
            interactive: interactive,
            defaultScrollbars: true,
            customStyle: customStyle,
            resize: this.options.resizeScrollbars,
            shrink: this.options.shrinkScrollbars,
            fade: this.options.fadeScrollbars,
            listenY: false
          };

          this.wrapper.appendChild(indicator.el);
          indicators.push(indicator);
        }
      }

      if ( this.options.indicators ) {
        // TODO: check concat compatibility
        indicators = indicators.concat(this.options.indicators);
      }

      for ( var i = indicators.length; i--; ) {
        this.indicators.push( new Indicator(this, indicators[i]) );
      }

      // TODO: check if we can use array.map (wide compatibility and performance issues)
      function _indicatorsMap (fn) {
        for ( var i = that.indicators.length; i--; ) {
          fn.call(that.indicators[i]);
        }
      }

      if ( this.options.fadeScrollbars ) {
        this.on('scrollEnd', function () {
          _indicatorsMap(function () {
            this.fade();
          });
        });

        this.on('scrollCancel', function () {
          _indicatorsMap(function () {
            this.fade();
          });
        });

        this.on('scrollStart', function () {
          _indicatorsMap(function () {
            this.fade(1);
          });
        });

        this.on('beforeScrollStart', function () {
          _indicatorsMap(function () {
            this.fade(1, true);
          });
        });
      }


      this.on('refresh', function () {
        _indicatorsMap(function () {
          this.refresh();
        });
      });

      this.on('destroy', function () {
        _indicatorsMap(function () {
          this.destroy();
        });

        delete this.indicators;
      });
    },

    _initWheel: function () {
      utils.addEvent(this.wrapper, 'wheel', this);
      utils.addEvent(this.wrapper, 'mousewheel', this);
      utils.addEvent(this.wrapper, 'DOMMouseScroll', this);

      this.on('destroy', function () {
        utils.removeEvent(this.wrapper, 'wheel', this);
        utils.removeEvent(this.wrapper, 'mousewheel', this);
        utils.removeEvent(this.wrapper, 'DOMMouseScroll', this);
      });
    },

    _wheel: function (e) {
      if ( !this.enabled ) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      var wheelDeltaX, wheelDeltaY,
      newX, newY,
      that = this;

      if ( this.wheelTimeout === undefined ) {
        that._execEvent('scrollStart');
      }

      // Execute the scrollEnd event after 400ms the wheel stopped scrolling
      clearTimeout(this.wheelTimeout);
      this.wheelTimeout = setTimeout(function () {
        that._execEvent('scrollEnd');
        that.wheelTimeout = undefined;
      }, 400);

      if ( 'deltaX' in e ) {
        wheelDeltaX = -e.deltaX;
        wheelDeltaY = -e.deltaY;
      } else if ( 'wheelDeltaX' in e ) {
        wheelDeltaX = e.wheelDeltaX / 120 * this.options.mouseWheelSpeed;
        wheelDeltaY = e.wheelDeltaY / 120 * this.options.mouseWheelSpeed;
      } else if ( 'wheelDelta' in e ) {
        wheelDeltaX = wheelDeltaY = e.wheelDelta / 120 * this.options.mouseWheelSpeed;
      } else if ( 'detail' in e ) {
        wheelDeltaX = wheelDeltaY = -e.detail / 3 * this.options.mouseWheelSpeed;
      } else {
        return;
      }

      wheelDeltaX *= this.options.invertWheelDirection;
      wheelDeltaY *= this.options.invertWheelDirection;

      if ( !this.hasVerticalScroll ) {
        wheelDeltaX = wheelDeltaY;
        wheelDeltaY = 0;
      }

      if ( this.options.snap ) {
        newX = this.currentPage.pageX;
        newY = this.currentPage.pageY;

        if ( wheelDeltaX > 0 ) {
          newX--;
        } else if ( wheelDeltaX < 0 ) {
          newX++;
        }

        if ( wheelDeltaY > 0 ) {
          newY--;
        } else if ( wheelDeltaY < 0 ) {
          newY++;
        }

        this.goToPage(newX, newY);

        return;
      }

      newX = this.x + Math.round(this.hasHorizontalScroll ? wheelDeltaX : 0);
      newY = this.y + Math.round(this.hasVerticalScroll ? wheelDeltaY : 0);

      if ( newX > 0 ) {
        newX = 0;
      } else if ( newX < this.maxScrollX ) {
        newX = this.maxScrollX;
      }

      if ( newY > 0 ) {
        newY = 0;
      } else if ( newY < this.maxScrollY ) {
        newY = this.maxScrollY;
      }

      this.scrollTo(newX, newY, 0);

// INSERT POINT: _wheel
    },

    _initSnap: function () {
      this.currentPage = {};

      if ( typeof this.options.snap == 'string' ) {
        this.options.snap = this.scroller.querySelectorAll(this.options.snap);
      }

      this.on('refresh', function () {
        var i = 0, l,
        m = 0, n,
        cx, cy,
        x = 0, y,
        stepX = this.options.snapStepX || this.wrapperWidth,
        stepY = this.options.snapStepY || this.wrapperHeight,
        el;

        this.pages = [];

        if ( !this.wrapperWidth || !this.wrapperHeight || !this.scrollerWidth || !this.scrollerHeight ) {
          return;
        }

        if ( this.options.snap === true ) {
          cx = Math.round( stepX / 2 );
          cy = Math.round( stepY / 2 );

          while ( x > -this.scrollerWidth ) {
            this.pages[i] = [];
            l = 0;
            y = 0;

            while ( y > -this.scrollerHeight ) {
              this.pages[i][l] = {
                x: Math.max(x, this.maxScrollX),
                y: Math.max(y, this.maxScrollY),
                width: stepX,
                height: stepY,
                cx: x - cx,
                cy: y - cy
              };

              y -= stepY;
              l++;
            }

            x -= stepX;
            i++;
          }
        } else {
          el = this.options.snap;
          l = el.length;
          n = -1;

          for ( ; i < l; i++ ) {
            if ( i === 0 || el[i].offsetLeft <= el[i-1].offsetLeft ) {
              m = 0;
              n++;
            }

            if ( !this.pages[m] ) {
              this.pages[m] = [];
            }

            x = Math.max(-el[i].offsetLeft, this.maxScrollX);
            y = Math.max(-el[i].offsetTop, this.maxScrollY);
            cx = x - Math.round(el[i].offsetWidth / 2);
            cy = y - Math.round(el[i].offsetHeight / 2);

            this.pages[m][n] = {
              x: x,
              y: y,
              width: el[i].offsetWidth,
              height: el[i].offsetHeight,
              cx: cx,
              cy: cy
            };

            if ( x > this.maxScrollX ) {
              m++;
            }
          }
        }

        this.goToPage(this.currentPage.pageX || 0, this.currentPage.pageY || 0, 0);

        // Update snap threshold if needed
        if ( this.options.snapThreshold % 1 === 0 ) {
          this.snapThresholdX = this.options.snapThreshold;
          this.snapThresholdY = this.options.snapThreshold;
        } else {
          this.snapThresholdX = Math.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].width * this.options.snapThreshold);
          this.snapThresholdY = Math.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].height * this.options.snapThreshold);
        }
      });

      this.on('flick', function () {
        var time = this.options.snapSpeed || Math.max(
        Math.max(
        Math.min(Math.abs(this.x - this.startX), 1000),
        Math.min(Math.abs(this.y - this.startY), 1000)
        ), 300);

        this.goToPage(
        this.currentPage.pageX + this.directionX,
        this.currentPage.pageY + this.directionY,
        time
        );
      });
    },

    _nearestSnap: function (x, y) {
      if ( !this.pages.length ) {
        return { x: 0, y: 0, pageX: 0, pageY: 0 };
      }

      var i = 0,
      l = this.pages.length,
      m = 0;

      // Check if we exceeded the snap threshold
      if ( Math.abs(x - this.absStartX) < this.snapThresholdX &&
           Math.abs(y - this.absStartY) < this.snapThresholdY ) {
        return this.currentPage;
      }

      if ( x > 0 ) {
        x = 0;
      } else if ( x < this.maxScrollX ) {
        x = this.maxScrollX;
      }

      if ( y > 0 ) {
        y = 0;
      } else if ( y < this.maxScrollY ) {
        y = this.maxScrollY;
      }

      for ( ; i < l; i++ ) {
        if ( x >= this.pages[i][0].cx ) {
          x = this.pages[i][0].x;
          break;
        }
      }

      l = this.pages[i].length;

      for ( ; m < l; m++ ) {
        if ( y >= this.pages[0][m].cy ) {
          y = this.pages[0][m].y;
          break;
        }
      }

      if ( i == this.currentPage.pageX ) {
        i += this.directionX;

        if ( i < 0 ) {
          i = 0;
        } else if ( i >= this.pages.length ) {
          i = this.pages.length - 1;
        }

        x = this.pages[i][0].x;
      }

      if ( m == this.currentPage.pageY ) {
        m += this.directionY;

        if ( m < 0 ) {
          m = 0;
        } else if ( m >= this.pages[0].length ) {
          m = this.pages[0].length - 1;
        }

        y = this.pages[0][m].y;
      }

      return {
        x: x,
        y: y,
        pageX: i,
        pageY: m
      };
    },

    goToPage: function (x, y, time, easing) {
      easing = easing || this.options.bounceEasing;

      if ( x >= this.pages.length ) {
        x = this.pages.length - 1;
      } else if ( x < 0 ) {
        x = 0;
      }

      if ( y >= this.pages[x].length ) {
        y = this.pages[x].length - 1;
      } else if ( y < 0 ) {
        y = 0;
      }

      var posX = this.pages[x][y].x,
      posY = this.pages[x][y].y;

      time = time === undefined ? this.options.snapSpeed || Math.max(
      Math.max(
      Math.min(Math.abs(posX - this.x), 1000),
      Math.min(Math.abs(posY - this.y), 1000)
      ), 300) : time;

      this.currentPage = {
        x: posX,
        y: posY,
        pageX: x,
        pageY: y
      };

      this.scrollTo(posX, posY, time, easing);
    },

    next: function (time, easing) {
      var x = this.currentPage.pageX,
      y = this.currentPage.pageY;

      x++;

      if ( x >= this.pages.length && this.hasVerticalScroll ) {
        x = 0;
        y++;
      }

      this.goToPage(x, y, time, easing);
    },

    prev: function (time, easing) {
      var x = this.currentPage.pageX,
      y = this.currentPage.pageY;

      x--;

      if ( x < 0 && this.hasVerticalScroll ) {
        x = 0;
        y--;
      }

      this.goToPage(x, y, time, easing);
    },

    _initKeys: function (e) {
      // default key bindings
      var keys = {
        pageUp: 33,
        pageDown: 34,
        end: 35,
        home: 36,
        left: 37,
        up: 38,
        right: 39,
        down: 40
      };
      var i;

      // if you give me characters I give you keycode
      if ( typeof this.options.keyBindings == 'object' ) {
        for ( i in this.options.keyBindings ) {
          if ( typeof this.options.keyBindings[i] == 'string' ) {
            this.options.keyBindings[i] = this.options.keyBindings[i].toUpperCase().charCodeAt(0);
          }
        }
      } else {
        this.options.keyBindings = {};
      }

      for ( i in keys ) {
        this.options.keyBindings[i] = this.options.keyBindings[i] || keys[i];
      }

      utils.addEvent(window, 'keydown', this);

      this.on('destroy', function () {
        utils.removeEvent(window, 'keydown', this);
      });
    },

    _key: function (e) {
      if ( !this.enabled ) {
        return;
      }

      var snap = this.options.snap,	// we are using this alot, better to cache it
      newX = snap ? this.currentPage.pageX : this.x,
      newY = snap ? this.currentPage.pageY : this.y,
      now = utils.getTime(),
      prevTime = this.keyTime || 0,
      acceleration = 0.250,
      pos;

      if ( this.options.useTransition && this.isInTransition ) {
        pos = this.getComputedPosition();

        this._translate(Math.round(pos.x), Math.round(pos.y));
        this.isInTransition = false;
      }

      this.keyAcceleration = now - prevTime < 200 ? Math.min(this.keyAcceleration + acceleration, 50) : 0;

      switch ( e.keyCode ) {
        case this.options.keyBindings.pageUp:
          if ( this.hasHorizontalScroll && !this.hasVerticalScroll ) {
            newX += snap ? 1 : this.wrapperWidth;
          } else {
            newY += snap ? 1 : this.wrapperHeight;
          }
          break;
        case this.options.keyBindings.pageDown:
          if ( this.hasHorizontalScroll && !this.hasVerticalScroll ) {
            newX -= snap ? 1 : this.wrapperWidth;
          } else {
            newY -= snap ? 1 : this.wrapperHeight;
          }
          break;
        case this.options.keyBindings.end:
          newX = snap ? this.pages.length-1 : this.maxScrollX;
          newY = snap ? this.pages[0].length-1 : this.maxScrollY;
          break;
        case this.options.keyBindings.home:
          newX = 0;
          newY = 0;
          break;
        case this.options.keyBindings.left:
          newX += snap ? -1 : 5 + this.keyAcceleration>>0;
          break;
        case this.options.keyBindings.up:
          newY += snap ? 1 : 5 + this.keyAcceleration>>0;
          break;
        case this.options.keyBindings.right:
          newX -= snap ? -1 : 5 + this.keyAcceleration>>0;
          break;
        case this.options.keyBindings.down:
          newY -= snap ? 1 : 5 + this.keyAcceleration>>0;
          break;
        default:
          return;
      }

      if ( snap ) {
        this.goToPage(newX, newY);
        return;
      }

      if ( newX > 0 ) {
        newX = 0;
        this.keyAcceleration = 0;
      } else if ( newX < this.maxScrollX ) {
        newX = this.maxScrollX;
        this.keyAcceleration = 0;
      }

      if ( newY > 0 ) {
        newY = 0;
        this.keyAcceleration = 0;
      } else if ( newY < this.maxScrollY ) {
        newY = this.maxScrollY;
        this.keyAcceleration = 0;
      }

      this.scrollTo(newX, newY, 0);

      this.keyTime = now;
    },

    _animate: function (destX, destY, duration, easingFn) {
      var that = this,
      startX = this.x,
      startY = this.y,
      startTime = utils.getTime(),
      destTime = startTime + duration;

      function step () {
        var now = utils.getTime(),
        newX, newY,
        easing;

        if ( now >= destTime ) {
          that.isAnimating = false;
          that._translate(destX, destY);

          if ( !that.resetPosition(that.options.bounceTime) ) {
            that._execEvent('scrollEnd');
          }

          return;
        }

        now = ( now - startTime ) / duration;
        easing = easingFn(now);
        newX = ( destX - startX ) * easing + startX;
        newY = ( destY - startY ) * easing + startY;
        that._translate(newX, newY);

        if ( that.isAnimating ) {
          rAF(step);
        }
      }

      this.isAnimating = true;
      step();
    },
    handleEvent: function (e) {
      switch ( e.type ) {
        case 'touchstart':
        case 'pointerdown':
        case 'MSPointerDown':
        case 'mousedown':
          this._start(e);
          break;
        case 'touchmove':
        case 'pointermove':
        case 'MSPointerMove':
        case 'mousemove':
          this._move(e);
          break;
        case 'touchend':
        case 'pointerup':
        case 'MSPointerUp':
        case 'mouseup':
        case 'touchcancel':
        case 'pointercancel':
        case 'MSPointerCancel':
        case 'mousecancel':
          this._end(e);
          break;
        case 'orientationchange':
        case 'resize':
          this._resize();
          break;
        case 'transitionend':
        case 'webkitTransitionEnd':
        case 'oTransitionEnd':
        case 'MSTransitionEnd':
          this._transitionEnd(e);
          break;
        case 'wheel':
        case 'DOMMouseScroll':
        case 'mousewheel':
          this._wheel(e);
          break;
        case 'keydown':
          this._key(e);
          break;
        case 'click':
          if ( !e._constructed ) {
            e.preventDefault();
            e.stopPropagation();
          }
          break;
      }
    }
  };
  function createDefaultScrollbar (direction, interactive, type) {
    var scrollbar = document.createElement('div'),
    indicator = document.createElement('div');

    if ( type === true ) {
      scrollbar.style.cssText = 'position:absolute;z-index:9999';
      indicator.style.cssText = '-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:absolute;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);border-radius:3px';
    }

    indicator.className = 'iScrollIndicator';

    if ( direction == 'h' ) {
      if ( type === true ) {
        scrollbar.style.cssText += ';height:7px;left:2px;right:2px;bottom:0';
        indicator.style.height = '100%';
      }
      scrollbar.className = 'iScrollHorizontalScrollbar';
    } else {
      if ( type === true ) {
        scrollbar.style.cssText += ';width:7px;bottom:2px;top:2px;right:1px';
        indicator.style.width = '100%';
      }
      scrollbar.className = 'iScrollVerticalScrollbar';
    }

    scrollbar.style.cssText += ';overflow:hidden';

    if ( !interactive ) {
      scrollbar.style.pointerEvents = 'none';
    }

    scrollbar.appendChild(indicator);

    return scrollbar;
  }

  function Indicator (scroller, options) {
    this.wrapper = typeof options.el == 'string' ? document.querySelector(options.el) : options.el;
    this.wrapperStyle = this.wrapper.style;
    this.indicator = this.wrapper.children[0];
    this.indicatorStyle = this.indicator.style;
    this.scroller = scroller;

    this.options = {
      listenX: true,
      listenY: true,
      interactive: false,
      resize: true,
      defaultScrollbars: false,
      shrink: false,
      fade: false,
      speedRatioX: 0,
      speedRatioY: 0
    };

    for ( var i in options ) {
      this.options[i] = options[i];
    }

    this.sizeRatioX = 1;
    this.sizeRatioY = 1;
    this.maxPosX = 0;
    this.maxPosY = 0;

    if ( this.options.interactive ) {
      if ( !this.options.disableTouch ) {
        utils.addEvent(this.indicator, 'touchstart', this);
        utils.addEvent(window, 'touchend', this);
      }
      if ( !this.options.disablePointer ) {
        utils.addEvent(this.indicator, utils.prefixPointerEvent('pointerdown'), this);
        utils.addEvent(window, utils.prefixPointerEvent('pointerup'), this);
      }
      if ( !this.options.disableMouse ) {
        utils.addEvent(this.indicator, 'mousedown', this);
        utils.addEvent(window, 'mouseup', this);
      }
    }

    if ( this.options.fade ) {
      this.wrapperStyle[utils.style.transform] = this.scroller.translateZ;
      this.wrapperStyle[utils.style.transitionDuration] = utils.isBadAndroid ? '0.001s' : '0ms';
      this.wrapperStyle.opacity = '0';
    }
  }

  Indicator.prototype = {
    handleEvent: function (e) {
      switch ( e.type ) {
        case 'touchstart':
        case 'pointerdown':
        case 'MSPointerDown':
        case 'mousedown':
          this._start(e);
          break;
        case 'touchmove':
        case 'pointermove':
        case 'MSPointerMove':
        case 'mousemove':
          this._move(e);
          break;
        case 'touchend':
        case 'pointerup':
        case 'MSPointerUp':
        case 'mouseup':
        case 'touchcancel':
        case 'pointercancel':
        case 'MSPointerCancel':
        case 'mousecancel':
          this._end(e);
          break;
      }
    },

    destroy: function () {
      if ( this.options.interactive ) {
        utils.removeEvent(this.indicator, 'touchstart', this);
        utils.removeEvent(this.indicator, utils.prefixPointerEvent('pointerdown'), this);
        utils.removeEvent(this.indicator, 'mousedown', this);

        utils.removeEvent(window, 'touchmove', this);
        utils.removeEvent(window, utils.prefixPointerEvent('pointermove'), this);
        utils.removeEvent(window, 'mousemove', this);

        utils.removeEvent(window, 'touchend', this);
        utils.removeEvent(window, utils.prefixPointerEvent('pointerup'), this);
        utils.removeEvent(window, 'mouseup', this);
      }

      if ( this.options.defaultScrollbars ) {
        this.wrapper.parentNode.removeChild(this.wrapper);
      }
    },

    _start: function (e) {
      var point = e.touches ? e.touches[0] : e;

      e.preventDefault();
      e.stopPropagation();

      this.transitionTime();

      this.initiated = true;
      this.moved = false;
      this.lastPointX	= point.pageX;
      this.lastPointY	= point.pageY;

      this.startTime	= utils.getTime();

      if ( !this.options.disableTouch ) {
        utils.addEvent(window, 'touchmove', this);
      }
      if ( !this.options.disablePointer ) {
        utils.addEvent(window, utils.prefixPointerEvent('pointermove'), this);
      }
      if ( !this.options.disableMouse ) {
        utils.addEvent(window, 'mousemove', this);
      }

      this.scroller._execEvent('beforeScrollStart');
    },

    _move: function (e) {
      var point = e.touches ? e.touches[0] : e,
      deltaX, deltaY,
      newX, newY,
      timestamp = utils.getTime();

      if ( !this.moved ) {
        this.scroller._execEvent('scrollStart');
      }

      this.moved = true;

      deltaX = point.pageX - this.lastPointX;
      this.lastPointX = point.pageX;

      deltaY = point.pageY - this.lastPointY;
      this.lastPointY = point.pageY;

      newX = this.x + deltaX;
      newY = this.y + deltaY;

      this._pos(newX, newY);

// INSERT POINT: indicator._move

      e.preventDefault();
      e.stopPropagation();
    },

    _end: function (e) {
      if ( !this.initiated ) {
        return;
      }

      this.initiated = false;

      e.preventDefault();
      e.stopPropagation();

      utils.removeEvent(window, 'touchmove', this);
      utils.removeEvent(window, utils.prefixPointerEvent('pointermove'), this);
      utils.removeEvent(window, 'mousemove', this);

      if ( this.scroller.options.snap ) {
        var snap = this.scroller._nearestSnap(this.scroller.x, this.scroller.y);

        var time = this.options.snapSpeed || Math.max(
        Math.max(
        Math.min(Math.abs(this.scroller.x - snap.x), 1000),
        Math.min(Math.abs(this.scroller.y - snap.y), 1000)
        ), 300);

        if ( this.scroller.x != snap.x || this.scroller.y != snap.y ) {
          this.scroller.directionX = 0;
          this.scroller.directionY = 0;
          this.scroller.currentPage = snap;
          this.scroller.scrollTo(snap.x, snap.y, time, this.scroller.options.bounceEasing);
        }
      }

      if ( this.moved ) {
        this.scroller._execEvent('scrollEnd');
      }
    },

    transitionTime: function (time) {
      time = time || 0;
      this.indicatorStyle[utils.style.transitionDuration] = time + 'ms';

      if ( !time && utils.isBadAndroid ) {
        this.indicatorStyle[utils.style.transitionDuration] = '0.001s';
      }
    },

    transitionTimingFunction: function (easing) {
      this.indicatorStyle[utils.style.transitionTimingFunction] = easing;
    },

    refresh: function () {
      this.transitionTime();

      if ( this.options.listenX && !this.options.listenY ) {
        this.indicatorStyle.display = this.scroller.hasHorizontalScroll ? 'block' : 'none';
      } else if ( this.options.listenY && !this.options.listenX ) {
        this.indicatorStyle.display = this.scroller.hasVerticalScroll ? 'block' : 'none';
      } else {
        this.indicatorStyle.display = this.scroller.hasHorizontalScroll || this.scroller.hasVerticalScroll ? 'block' : 'none';
      }

      if ( this.scroller.hasHorizontalScroll && this.scroller.hasVerticalScroll ) {
        utils.addClass(this.wrapper, 'iScrollBothScrollbars');
        utils.removeClass(this.wrapper, 'iScrollLoneScrollbar');

        if ( this.options.defaultScrollbars && this.options.customStyle ) {
          if ( this.options.listenX ) {
            this.wrapper.style.right = '8px';
          } else {
            this.wrapper.style.bottom = '8px';
          }
        }
      } else {
        utils.removeClass(this.wrapper, 'iScrollBothScrollbars');
        utils.addClass(this.wrapper, 'iScrollLoneScrollbar');

        if ( this.options.defaultScrollbars && this.options.customStyle ) {
          if ( this.options.listenX ) {
            this.wrapper.style.right = '2px';
          } else {
            this.wrapper.style.bottom = '2px';
          }
        }
      }

      var r = this.wrapper.offsetHeight;	// force refresh

      if ( this.options.listenX ) {
        this.wrapperWidth = this.wrapper.clientWidth;
        if ( this.options.resize ) {
          this.indicatorWidth = Math.max(Math.round(this.wrapperWidth * this.wrapperWidth / (this.scroller.scrollerWidth || this.wrapperWidth || 1)), 8);
          this.indicatorStyle.width = this.indicatorWidth + 'px';
        } else {
          this.indicatorWidth = this.indicator.clientWidth;
        }

        this.maxPosX = this.wrapperWidth - this.indicatorWidth;

        if ( this.options.shrink == 'clip' ) {
          this.minBoundaryX = -this.indicatorWidth + 8;
          this.maxBoundaryX = this.wrapperWidth - 8;
        } else {
          this.minBoundaryX = 0;
          this.maxBoundaryX = this.maxPosX;
        }

        this.sizeRatioX = this.options.speedRatioX || (this.scroller.maxScrollX && (this.maxPosX / this.scroller.maxScrollX));
      }

      if ( this.options.listenY ) {
        this.wrapperHeight = this.wrapper.clientHeight;
        if ( this.options.resize ) {
          this.indicatorHeight = Math.max(Math.round(this.wrapperHeight * this.wrapperHeight / (this.scroller.scrollerHeight || this.wrapperHeight || 1)), 8);
          this.indicatorStyle.height = this.indicatorHeight + 'px';
        } else {
          this.indicatorHeight = this.indicator.clientHeight;
        }

        this.maxPosY = this.wrapperHeight - this.indicatorHeight;

        if ( this.options.shrink == 'clip' ) {
          this.minBoundaryY = -this.indicatorHeight + 8;
          this.maxBoundaryY = this.wrapperHeight - 8;
        } else {
          this.minBoundaryY = 0;
          this.maxBoundaryY = this.maxPosY;
        }

        this.maxPosY = this.wrapperHeight - this.indicatorHeight;
        this.sizeRatioY = this.options.speedRatioY || (this.scroller.maxScrollY && (this.maxPosY / this.scroller.maxScrollY));
      }

      this.updatePosition();
    },

    updatePosition: function () {
      var x = this.options.listenX && Math.round(this.sizeRatioX * this.scroller.x) || 0,
      y = this.options.listenY && Math.round(this.sizeRatioY * this.scroller.y) || 0;

      if ( !this.options.ignoreBoundaries ) {
        if ( x < this.minBoundaryX ) {
          if ( this.options.shrink == 'scale' ) {
            this.width = Math.max(this.indicatorWidth + x, 8);
            this.indicatorStyle.width = this.width + 'px';
          }
          x = this.minBoundaryX;
        } else if ( x > this.maxBoundaryX ) {
          if ( this.options.shrink == 'scale' ) {
            this.width = Math.max(this.indicatorWidth - (x - this.maxPosX), 8);
            this.indicatorStyle.width = this.width + 'px';
            x = this.maxPosX + this.indicatorWidth - this.width;
          } else {
            x = this.maxBoundaryX;
          }
        } else if ( this.options.shrink == 'scale' && this.width != this.indicatorWidth ) {
          this.width = this.indicatorWidth;
          this.indicatorStyle.width = this.width + 'px';
        }

        if ( y < this.minBoundaryY ) {
          if ( this.options.shrink == 'scale' ) {
            this.height = Math.max(this.indicatorHeight + y * 3, 8);
            this.indicatorStyle.height = this.height + 'px';
          }
          y = this.minBoundaryY;
        } else if ( y > this.maxBoundaryY ) {
          if ( this.options.shrink == 'scale' ) {
            this.height = Math.max(this.indicatorHeight - (y - this.maxPosY) * 3, 8);
            this.indicatorStyle.height = this.height + 'px';
            y = this.maxPosY + this.indicatorHeight - this.height;
          } else {
            y = this.maxBoundaryY;
          }
        } else if ( this.options.shrink == 'scale' && this.height != this.indicatorHeight ) {
          this.height = this.indicatorHeight;
          this.indicatorStyle.height = this.height + 'px';
        }
      }

      this.x = x;
      this.y = y;

      if ( this.scroller.options.useTransform ) {
        this.indicatorStyle[utils.style.transform] = 'translate(' + x + 'px,' + y + 'px)' + this.scroller.translateZ;
      } else {
        this.indicatorStyle.left = x + 'px';
        this.indicatorStyle.top = y + 'px';
      }
    },

    _pos: function (x, y) {
      if ( x < 0 ) {
        x = 0;
      } else if ( x > this.maxPosX ) {
        x = this.maxPosX;
      }

      if ( y < 0 ) {
        y = 0;
      } else if ( y > this.maxPosY ) {
        y = this.maxPosY;
      }

      x = this.options.listenX ? Math.round(x / this.sizeRatioX) : this.scroller.x;
      y = this.options.listenY ? Math.round(y / this.sizeRatioY) : this.scroller.y;

      this.scroller.scrollTo(x, y);
    },

    fade: function (val, hold) {
      if ( hold && !this.visible ) {
        return;
      }

      clearTimeout(this.fadeTimeout);
      this.fadeTimeout = null;

      var time = val ? 250 : 500,
      delay = val ? 0 : 300;

      val = val ? '1' : '0';

      this.wrapperStyle[utils.style.transitionDuration] = time + 'ms';

      this.fadeTimeout = setTimeout((function (val) {
        this.wrapperStyle.opacity = val;
        this.visible = +val;
      }).bind(this, val), delay);
    }
  };

  IScroll.utils = utils;

  if ( typeof module != 'undefined' && module.exports ) {
    module.exports = IScroll;
  } else {
    window.IScroll = IScroll;
  }

})(window, document, Math);
}catch(ex){
if(nike.error){
nike.error('An unhandled exception was thrown while executing nike.Iscroll. Make sure to look for previous errors because this might have failed as a result of another script failing', ex, 'Stack:', ex.stack, 'Message:', ex.message);
}
}
try{
var nike = nike || {};
nike.namespace("nike.exp.pdp.desktop.MiniPdpShell");

nike.requireDependency("nike.EventBus");
nike.requireDependency("HandlebarsRuntime");
nike.requireDependency("nike.exp.global.Modal");
nike.requireDependency("nike.exp.pdp.base.MiniPdpShell");
nike.requireDependency("nike.exp.pdp.templates.desktop.MiniPdpShell")
nike.requireDependency("nike.exp.pdp.templates.ProductMessagingExpand");
nike.requireDependency("nike.exp.pdp.desktop.PreloadedAltHeroImage");
nike.requireDependency("nike.exp.pdp.desktop.MiniPdpColorways");
nike.requireDependency("nike.exp.pdp.desktop.BuyingTools");
nike.requireDependency("nike.exp.pdp.desktop.ProductTitle");
nike.requireDependency("nike.exp.pdp.desktop.ProductPrice");
nike.requireDependency("nike.exp.pdp.desktop.VatMessaging");
nike.requireDependency("nike.exp.pdp.desktop.AvailabilityMessaging");
nike.requireDependency("nike.exp.pdp.desktop.GeneralCustomMessage");
nike.requireDependency("nike.exp.pdp.desktop.AddToCartMessaging");
nike.requireDependency("nike.exp.pdp.desktop.BrowseOnlyMessage");
nike.requireDependency("nike.exp.pdp.desktop.LinkToPdp");
nike.requireDependency('nike.exp.pdp.base.MiniPdpService');
nike.requireDependency('nike.exp.pdp.desktop.AltImages');
nike.requireDependency('nike.Cart');
nike.requireDependency('nike.util.UrlUtil');
nike.requireDependency('nike.exp.pdp.TemplateHelpers');
nike.requireDependency('nike.exp.pdp.Event');
nike.requireDependency('lib.lodash');
nike.requireDependency('nike.Iscroll');

(function() {
  var ALT_IMAGES_BREAKPOINT = 1024;

  nike.exp.pdp.desktop.MiniPdpShell = nike.exp.pdp.base.MiniPdpShell.extend({

    isIE8 : undefined,

    init: function() {
      this._super();
      this.template = 'MiniPdpShell';
      this.$pdpContainer = null;
      this.$loadingImage = null;
      this.$addToCartButton = null;
      this.$scrollWrap = null;
      this.$colorwaysScroller = null;
      this.miniPdpModal = null;
      this.link = null;
      this.productData = null;
      this.addToCartListener = null;
      this.cartMsg = false;
      this.colorChipsYPos = 0;
      this.colorwaysScrollerSize = 0;
      this.myScroll = null;

      /* Window resize listener to help determine orientation of the alt images needs to change. */
      if (nike.Util.windowResizeListen) {
        nike.Util.windowResizeListen($.proxy(function(){
          this.setAltImagesOrientation();
        }, this));
      }

      if (nike.listen){
        nike.listen(nike.Event.MINI_PDP_OPEN, $.proxy(
          function(event, data){
            this.handleShowMiniPdp(data.link);
          }, this ));
      }
    },

    setElement: function($element){
      this._super($element);
      this.initModal();
    },

    setViewModel: function(data){
      if(data && data.hasOwnProperty('imagesThumbnail')){
        data.altImagesAvailable = this.getAltImagesCount(data.imagesThumbnail);
      }

      this._super(data);
    },

    initSelectors: function(){
      this.$pdpContainer = this.$element.find('.mini-pdp-container');
      this.$loadingImage = this.$element.find('.loading-image');
      this.$addToCartButton = this.$element.find('button.add-to-cart');
      this.$scrollWrap = this.$element.find('.scroller-wrap');
      this.$colorwaysScroller = this.$element.find('.colorways-scroller');
    },

    initEventListeners : function(){
      this.$element.on(nike.exp.pdp.desktop.MiniPdpColorways.EVENT_COLORWAY_SELECTED, $.proxy(this.handleColorwaySelect, this));
      this.$element.on(nike.exp.pdp.desktop.MiniPdpColorways.EVENT_COLORWAYS_RESIZED, $.proxy(this.handleScrollerResize, this));
      this.$element.on('click', '.js-pdp-redirect-button', $.proxy(this.handleRedirectToPDP, this));
    },

    /* Set what the alt image orientation is going to be. */
    setAltImagesOrientation: function(){
      if(this.modules.preloadedAltHeroImage){
        // Sets the alt images carousel to horizontal if window width is smaller than the alt images breakpoint
        // or if the browser is IE8
        if (this.isIE8 || $(window).width() < ALT_IMAGES_BREAKPOINT) {
          this.modules.preloadedAltHeroImage.setOrientation(nike.exp.pdp.desktop.AltImages.HORIZONTAL);
        } else {
          this.modules.preloadedAltHeroImage.setOrientation(nike.exp.pdp.desktop.AltImages.VERTICAL);
        }
      }
    },

    /* Get Alt image count to either hide or show alt image container */
    getAltImagesCount: function(images){
      if(images.length > 0 && nike.exp.pdp.desktop.PreloadedAltHeroImage){
        return nike.exp.pdp.desktop.PreloadedAltHeroImage.ALT_IMAGES_TRUE;
      }else{
        return nike.exp.pdp.desktop.PreloadedAltHeroImage.ALT_IMAGES_FALSE;
      }
    },

    initModal : function(){
      var self = this;
      var modalOptions = {
        $content : this.$element,
        autoDestroy : false,
        blockerClickCloses : false,
        onClose : function(closeType) {
          if( closeType === nike.exp.global.Modal.CLOSE_TYPE.BUTTON ) {
            self.handleModalCloseClick();
          }
        }};
      this.miniPdpModal = new nike.exp.global.Modal(modalOptions);
    },

    /**
     * Show the mini-pdp, using an inline pdp to extract the needed ids for the mini pdp service
     * @param {String} link - Valid url for an inline pdp
     * @param {Boolean} [isColorwayLoad=false]
     */
    handleShowMiniPdp : function(link, isColorwayLoad){
      isColorwayLoad = isColorwayLoad === true;

      this.link = link;

      if(!link){
        nike.error("No link was sent to the mini pdp event listener", arguments);
        return;
      }
      //open modal showing loading icon
      this.miniPdpModal.open();

      var productRequestData = nike.exp.pdp.base.MiniPdpService.parseLinkForRequestData(link);

      nike.exp.pdp.base.MiniPdpService.requestPdpData(productRequestData)
        .then($.proxy(function(pdpData){
          // Emit the tracking event for a loaded MiniPDP

            var trackingProduct = _(pdpData.trackingData.product).clone();
            trackingProduct.siteId = trackingProduct.siteId || pdpData.siteId;

            nike.dispatchEvent(nike.Event.MINI_PDP_DATA_LOADED, {
              product: trackingProduct,
              colorwaychange: isColorwayLoad
            });

            this.setViewModel(pdpData);

            // CODE TO DESTROY
            if (this.modules.preloadedAltHeroImage) {
              this.modules.preloadedAltHeroImage.destroyHoverZoom();
            }

        }, this))
        .done($.proxy(function postTemplateRenderTasks () {
          // TODO: Explore moving this block so we can use ViewModule's postRender.
          this.isIE8 = this.checkForIE8();
          this.setAltImagesOrientation();
          this.initIscroll();
        }, this))
        .fail($.proxy(function(){
            window.location = this.link;
        }, this));

    },
    /**
     * Sets resize calculation event handlers for each colorway chip as it loads.
     * Triggers a resize calculation for iScroll just in case all chips are cached.
     */
    initIscroll : function() {
      // Get all colorway chips
      var $chips = this.$colorwaysScroller.find('img');
      var self = this;
      this.colorwaysScrollerSize = this.$colorwaysScroller.height();
      $chips.each(function (index, image) {
        // If image isn't loaded, assign an event to trigger resize once loaded
        if (!image.complete) {
          $(image).one('load', $.proxy(self.handleChipLoaded, self));
        }
      });
      // Trigger resize once for initialization in case all chips are cached or load before init.
      this.handleScrollerResize(null,{newHeight: this.$colorwaysScroller.height()});
    },

    broadcastResize : function () {
      this.$element.trigger(nike.exp.pdp.desktop.MiniPdpColorways.EVENT_COLORWAYS_RESIZED,
        {newHeight: this.$colorwaysScroller.height()});
    },

    /**
     * Compares scrollable container's new and previous heights and triggers a resize event if there's a delta
     */
    handleChipLoaded : function (event) {
      // Check to see if the old scroller size is different than the new.
      if (this.$colorwaysScroller.height() != this.colorwaysScrollerSize) {
        // Update the old comparison var and broadcast a resize.
        this.colorwaysScrollerSize = this.$colorwaysScroller.height();
        this.broadcastResize();
      }
    },

    /**
     * Condition 1 - Scrollable container's height is less than viewable area -> remove scrollbar
     * Condition 2 - Scrollable container's height is greater than viewable area ->
     *   Instantiate iScroll if it doesn't exist already
     *   Set the scrollbar to be visible
     */
    handleScrollerResize : function (event, data) {

      if (data.newHeight <= this.$scrollWrap.height()) {
        if (this.myScroll) {
          $('.iScrollLoneScrollbar').removeClass('visible');
        }
      } else {
        if (!this.myScroll) {
          this.myScroll = new IScroll('.scroller-wrap', {
            scrollbars: 'custom',
            interactiveScrollbars: true,
            mouseWheel: true
          });
        }
        $('.iScrollLoneScrollbar').addClass('visible');
        this.myScroll.scrollerHeight = data.newHeight;
        // bit of a hack to get the selected colorway and scroll to it
        // TODO: make this work well
//        var $selectedColorway = this.$element.find('.exp-colorway.selected');
//        if ($selectedColorway) {
//          this.myScroll.scrollToElement($selectedColorway[0]);
//        }
      }
      if (this.myScroll) {
        this.myScroll.refresh();
      }
    },

    /**
     * Navigate to the pdp when the user clicks the unlock or see details button.
     * @param event Jquery event
     */
    handleRedirectToPDP: function(event){
      var url = $(event.currentTarget).data('url');
      this.redirect(url);
    },

    /**
     * Sets the window.location to the provided URL param.
     * @param url
     */
    redirect: function(url){
      window.location = url;
    },

    handleModalCloseClick : function(){
      // Set the viewModel to an empty object to clear data and reinit the loading screen.
      this.myScroll = null;
      this.setViewModel({});
    },

    handleColorwaySelect: function(event, data) {
      var selectedColorway = data.selectedColorway;
      this.handleShowMiniPdp(selectedColorway.url, true);
    },

    checkForIE8: function() {
      var userAgentString = '';

      if (navigator) {
        userAgentString = navigator.userAgent;
      }

      return (userAgentString.indexOf('Trident/4') != -1) || (userAgentString.indexOf('MSIE 8') != -1 && userAgentString.indexOf('Trident') == -1);
    }

  });

  nike.exp.pdp.desktop.MiniPdpShell.listenForCTAClicks = function(){
    var miniPdpShell = new nike.exp.pdp.desktop.MiniPdpShell();
    miniPdpShell.setElement($($('.mini-pdp-wrapper').children()[0]));

    var $miniPdpLinks = $('a[data-mini-pdp=true]');
    // Attach listeners to a tags with data-mini-pdp="true" but only on Desktop
    if (! $('body').hasClass('Tablet')) {
      $miniPdpLinks.attr('data-follow-link', 'false');
      $miniPdpLinks.click( $.proxy(
        function(event){
          event.preventDefault();

          var atag = $(event.currentTarget);
          var link = atag.attr("href");

          nike.dispatchEvent(nike.Event.MINI_PDP_OPEN, {link: link});

          return false;

        }, this));
    } else {
      $miniPdpLinks.attr('data-follow-link', 'true');
    }
    return miniPdpShell;
  };

  nike.DomReady(function() {
    nike.exp.pdp.desktop.MiniPdpShell.listenForCTAClicks();
  });

})();

}catch(ex){
if(nike.error){
nike.error('An unhandled exception was thrown while executing nike.exp.pdp.desktop.MiniPdpShell. Make sure to look for previous errors because this might have failed as a result of another script failing', ex, 'Stack:', ex.stack, 'Message:', ex.message);
}
}


try{
var nike = nike || {};
nike.namespace('nike.exp.util.ContentUtil');

nike.requireDependency('jQuery');

nike.exp.util.ContentUtil = {
  /**
   * Promise for setting a listener on the indicated button provided by DCF.
   * @param  {string} selector jQuery selector string.
   * @return {Promise}         Promise object that sets the selector's data-follow-link attribute
   *                           upon resolution.
   */
  listenCTAModal: function(selector){
    var contentCTAListener = $.Deferred();
    var $els = $(selector);

    if (!$els.length) {
      contentCTAListener.reject('function requires a valid selector');
    } else {
      $els.bind('touch click', function(e){
        var $el = $(this);

        e.preventDefault();

        contentCTAListener.resolve(e, function(val){
          $el.attr('data-follow-link', !!val);
        });
      });
    }

    return contentCTAListener;
  }
};

}catch(ex){
if(nike.error){
nike.error('An unhandled exception was thrown while executing nike.exp.util.ContentUtil. Make sure to look for previous errors because this might have failed as a result of another script failing', ex, 'Stack:', ex.stack, 'Message:', ex.message);
}
}
try{
var nike = nike || {};
nike.namespace('nike.exp.launch.CqNotify');

nike.requireDependency('nike.exp.util.ContentUtil');

(function () {
  /**
   * First set a listener on the "notify me" button from DCF found on the page.
   * Then create a modal with an iframe, the content consisting of the url provided by DCF.
   * Set a message listener from the iframe to close the modal.
   */
  nike.exp.util.ContentUtil.listenCTAModal('[data-notify-me="true"]')
    .then(function (e, setFollowLink) {
      e.preventDefault();
      e.stopPropagation();

      var isMobile = nike.exp.script.device_detect.isMobile();
      var isTablet = $('body').hasClass('Tablet');
      var $overflowDiv = $('<div></div>').css('overflow', 'hidden');
      var $iframe;
      var dcfModal;
      var resizePollId;

      $iframe = $('<iframe>', {
        src: $(e.delegateTarget).attr('href'),
        id: 'exp-notify-me',
        height: isMobile ? '100%' : '80vh',
        width: '100%',
        frameborder: 0,
        seamless: 'seamless'
      });

      dcfModal = new nike.exp.global.Modal({
        $content: $iframe,
        fullScreen: isMobile,
        hideCloseButton: isMobile,
        onClose: function(){
          clearInterval(resizePollId);
          //Remove the initialization listeners and setup a new listener that doesn't re-initialize the modal
          $('[data-notify-me="true"]')
            .off('click touch')
            .on('click touch', $.proxy(function(e){
              e.preventDefault();
              dcfModal.open();
            }, dcfModal));
          return true;
        }
      });

      if (isTablet) {
        $iframe.wrap($overflowDiv);
      }

      $(window).on('message.notifyMe', function (evt) {
        if (evt.originalEvent.data === 'CLOSE') {
          dcfModal.close();
        }
      });

      if (!isMobile) {
        $iframe.load(function() {
          var $el = $(this);

          if ($el.length) {
            resizePollId = setInterval(function(){
              var newheight = $el.get(0).contentWindow.document.body.offsetHeight;
              $el.css('height', newheight + "px");
            }, 500);
          }
        });
      }
      $iframe.load(function() {
        $(this).contents().find('html').css('width', '100vw');
      });

      setFollowLink(false);
      dcfModal.open();
  });

  // Automatically open the Notify Me modal if the url has the parameter "notifyMe"
  if (/[&\?]notifyMe\b/i.test(window.location)) {
    $('[data-notify-me="true"]').click();
  }

})();

}catch(ex){
if(nike.error){
nike.error('An unhandled exception was thrown while executing nike.exp.launch.CqNotify. Make sure to look for previous errors because this might have failed as a result of another script failing', ex, 'Stack:', ex.stack, 'Message:', ex.message);
}
}

if(nike.addLoadedScript){nike.addLoadedScript('nike.exp.pdp.desktop.AltImages', true);}
if(nike.addLoadedScript){nike.addLoadedScript('nike.exp.pdp.templates.desktop.AltImagesModule', true);}
if(nike.addLoadedScript){nike.addLoadedScript('nike.exp.pdp.desktop.ProductTitle', true);}
if(nike.addLoadedScript){nike.addLoadedScript('nike.exp.pdp.templates.desktop.ProductPriceModule', true);}
if(nike.addLoadedScript){nike.addLoadedScript('nike.exp.pdp.TemplateHelpers', true);}
if(nike.addLoadedScript){nike.addLoadedScript('nike.exp.util.ContentUtil', true);}
if(nike.addLoadedScript){nike.addLoadedScript('nike.exp.pdp.templates.desktop.PdpNotificationModule', true);}
if(nike.addLoadedScript){nike.addLoadedScript('nike.exp.pdp.templates.desktop.HeroImageModule', true);}
if(nike.addLoadedScript){nike.addLoadedScript('nike.Iscroll', true);}
if(nike.addLoadedScript){nike.addLoadedScript('nike.exp.pdp.HoverZoom', true);}
if(nike.addLoadedScript){nike.addLoadedScript('nike.exp.global.ColorwayStatus', true);}
if(nike.addLoadedScript){nike.addLoadedScript('nike.exp.pdp.desktop.BrowseOnlyMessage', true);}
if(nike.addLoadedScript){nike.addLoadedScript('nike.exp.pdp.desktop.MiniPdpColorways', true);}
if(nike.addLoadedScript){nike.addLoadedScript('nike.exp.pdp.base.ProductTitle', true);}
if(nike.addLoadedScript){nike.addLoadedScript('nike.exp.pdp.base.PdpNotification', true);}
if(nike.addLoadedScript){nike.addLoadedScript('nike.exp.launch.CqNotify', false);}
if(nike.addLoadedScript){nike.addLoadedScript('nike.exp.pdp.base.LinkToPdp', true);}
if(nike.addLoadedScript){nike.addLoadedScript('nike.exp.pdp.templates.desktop.ProductTitleModule', true);}
if(nike.addLoadedScript){nike.addLoadedScript('nike.exp.pdp.templates.desktop.MiniPdpShell', true);}
if(nike.addLoadedScript){nike.addLoadedScript('nike.exp.pdp.base.AltImages', true);}
if(nike.addLoadedScript){nike.addLoadedScript('nike.exp.pdp.base.BuyingTools', true);}
if(nike.addLoadedScript){nike.addLoadedScript('nike.exp.pdp.base.HeroImage', true);}
if(nike.addLoadedScript){nike.addLoadedScript('nike.exp.pdp.desktop.AvailabilityMessaging', true);}
if(nike.addLoadedScript){nike.addLoadedScript('nike.exp.pdp.desktop.GeneralCustomMessage', true);}
if(nike.addLoadedScript){nike.addLoadedScript('nike.exp.pdp.base.Colorways', true);}
if(nike.addLoadedScript){nike.addLoadedScript('nike.exp.pdp.base.MiniPdpShell', true);}
if(nike.addLoadedScript){nike.addLoadedScript('nike.exp.pdp.templates.desktop.ColorwaysModule', true);}
if(nike.addLoadedScript){nike.addLoadedScript('nike.exp.pdp.templates.ProductMessagingExpand', true);}
if(nike.addLoadedScript){nike.addLoadedScript('nike.exp.pdp.desktop.AddToCartMessaging', true);}
if(nike.addLoadedScript){nike.addLoadedScript('nike.exp.pdp.templates.desktop.BuyingToolsModule', true);}
if(nike.addLoadedScript){nike.addLoadedScript('nike.exp.pdp.templates.desktop.PreloadedAltHeroImageModule', true);}
if(nike.addLoadedScript){nike.addLoadedScript('nike.exp.pdp.base.ViewModule', true);}
if(nike.addLoadedScript){nike.addLoadedScript('nike.DragCarousel', true);}
if(nike.addLoadedScript){nike.addLoadedScript('nike.exp.pdp.base.BasePdpService', true);}
if(nike.addLoadedScript){nike.addLoadedScript('nike.exp.pdp.desktop.MiniPdpShell', false);}
if(nike.addLoadedScript){nike.addLoadedScript('nike.exp.pdp.desktop.PdpNotification', true);}
if(nike.addLoadedScript){nike.addLoadedScript('nike.exp.pdp.desktop.VatMessaging', true);}
if(nike.addLoadedScript){nike.addLoadedScript('nike.exp.pdp.base.MiniPdpService', true);}
if(nike.addLoadedScript){nike.addLoadedScript('nike.exp.pdp.desktop.ProductPrice', true);}
if(nike.addLoadedScript){nike.addLoadedScript('nike.exp.pdp.desktop.BuyingTools', true);}
if(nike.addLoadedScript){nike.addLoadedScript('nike.exp.pdp.ProductMessagingExpand', true);}
if(nike.addLoadedScript){nike.addLoadedScript('nike.exp.pdp.Event', true);}
if(nike.addLoadedScript){nike.addLoadedScript('PARTIAL:ProductMessagingExpand:nike.exp.pdp.templates.ProductMessagingExpand', true);}
if(nike.addLoadedScript){nike.addLoadedScript('nike.exp.global.PricingUtil', true);}
if(nike.addLoadedScript){nike.addLoadedScript('nike.exp.pdp.PdpTemplateHelpers', true);}
if(nike.addLoadedScript){nike.addLoadedScript('nike.exp.global.templatehelpers.PricingHelpers', true);}
if(nike.addLoadedScript){nike.addLoadedScript('nike.exp.pdp.ModuleHelpers', true);}
if(nike.addLoadedScript){nike.addLoadedScript('nike.exp.pdp.templates.desktop.LinkToPdpModule', true);}
if(nike.addLoadedScript){nike.addLoadedScript('nike.exp.pdp.base.PreloadedAltHeroImage', true);}
if(nike.addLoadedScript){nike.addLoadedScript('nike.exp.pdp.PdpToolTip', true);}
if(nike.addLoadedScript){nike.addLoadedScript('nike.exp.pdp.desktop.PreloadedAltHeroImage', true);}
if(nike.addLoadedScript){nike.addLoadedScript('nike.exp.pdp.desktop.LinkToPdp', true);}
if(nike.addLoadedScript){nike.addLoadedScript('nike.exp.pdp.base.ProductPrice', true);}
if(nike.addLoadedScript){nike.addLoadedScript('nike.exp.pdp.desktop.HeroImage', true);}
if(nike.addLoadedScript){nike.addLoadedScript('nike.exp.pdp.templates.desktop.AvailabilityMessagingModule', true);}