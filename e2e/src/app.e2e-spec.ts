'use strict'; // necessary for es6 output in node

import { browser, element, by, ElementFinder, ElementArrayFinder } from 'protractor';
import { promise } from 'selenium-webdriver';

const expectedH1 = 'Tour of Bonds';
const expectedTitle = `${expectedH1}`;
const targetBond = { id: 30, name: 'Bearer' };
const targetBondDashboardIndex = 1;
const nameSuffix = 'X';
const newBondName = targetBond.name + nameSuffix;
const searchTargetBond = { id: 100, name: 'Contractor License' };

class Bond {
  id: number;
  name: string;

  // Factory methods

  // Bond from string formatted as '<id> <name>'.
  static fromString(s: string): Bond {
    return {
      id: +s.substr(0, s.indexOf(' ')),
      name: s.substr(s.indexOf(' ') + 1),
    };
  }

  // Bond from bond list <li> element.
  static async fromLi(li: ElementFinder): Promise<Bond> {
      const stringsFromA = await li.all(by.css('a')).getText();
      const strings = stringsFromA[0].split(' ');
      return { id: +strings[0], name: strings[1] };
  }

  // Bond id and name from the given detail element.
  static async fromDetail(detail: ElementFinder): Promise<Bond> {
    // Get bond id from the first <div>
    const _id = await detail.all(by.css('div')).first().getText();
    // Get name from the h2
    const _name = await detail.element(by.css('h2')).getText();
    return {
        id: +_id.substr(_id.indexOf(' ') + 1),
        name: _name.substr(0, _name.lastIndexOf(' '))
    };
  }
}

describe('Tour Of Bonds Landing Page', () => {

  beforeAll(() => browser.get(''));

  function getPageElts() {
    const navElts = element.all(by.css('app-root nav a'));

    return {
      navElts,

      appDashboardHref: navElts.get(0),
      appDashboard: element(by.css('app-root app-dashboard')),
      topBonds: element.all(by.css('app-root app-dashboard > div h4')),

      appBondsHref: navElts.get(1),
      appBonds: element(by.css('app-root app-bonds')),
      allBonds: element.all(by.css('app-root app-bonds li')),
      selectedBondSubview: element(by.css('app-root app-bonds > div:last-child')),

      bondDetail: element(by.css('app-root app-bond-detail > div')),

      searchBox: element(by.css('#search-box')),
      searchResults: element.all(by.css('.search-result li'))
    };
  }

  describe('Initial page', () => {

    it(`has title '${expectedTitle}'`, () => {
      expect(browser.getTitle()).toEqual(expectedTitle);
    });

    it(`has h1 '${expectedH1}'`, () => {
        expectHeading(1, expectedH1);
    });

    const expectedViewNames = ['Dashboard', 'Bonds'];
    it(`has views ${expectedViewNames}`, () => {
      const viewNames = getPageElts().navElts.map((el: ElementFinder) => el.getText());
      expect(viewNames).toEqual(expectedViewNames);
    });

    it('has dashboard as the active view', () => {
      const page = getPageElts();
      expect(page.appDashboard.isPresent()).toBeTruthy();
    });

  });

  describe('Dashboard tests', () => {

    beforeAll(() => browser.get(''));

    it('has top bonds', () => {
      const page = getPageElts();
      expect(page.topBonds.count()).toEqual(4);
    });

    it(`selects and routes to ${targetBond.name} details`, dashboardSelectTargetBond);

    it(`updates bond name (${newBondName}) in details view`, updateBondNameInDetailView);

    it(`cancels and shows ${targetBond.name} in Dashboard`, () => {
      element(by.buttonText('go back')).click();
      browser.waitForAngular(); // seems necessary to gets tests to pass for toh-pt6

      const targetBondElt = getPageElts().topBonds.get(targetBondDashboardIndex);
      expect(targetBondElt.getText()).toEqual(targetBond.name);
    });

    it(`selects and routes to ${targetBond.name} details`, dashboardSelectTargetBond);

    it(`updates bond name (${newBondName}) in details view`, updateBondNameInDetailView);

    it(`saves and shows ${newBondName} in Dashboard`, () => {
      element(by.buttonText('save')).click();
      browser.waitForAngular(); // seems necessary to gets tests to pass for toh-pt6

      const targetBondElt = getPageElts().topBonds.get(targetBondDashboardIndex);
      expect(targetBondElt.getText()).toEqual(newBondName);
    });

  });

  describe('Bonds tests', () => {

    beforeAll(() => browser.get(''));

    it('can switch to Bonds view', () => {
      getPageElts().appBondsHref.click();
      const page = getPageElts();
      expect(page.appBonds.isPresent()).toBeTruthy();
      expect(page.allBonds.count()).toEqual(15, 'number of bonds');
    });

    it('can route to bond details', async () => {
      getBondLiEltById(targetBond.id).click();

      const page = getPageElts();
      expect(page.bondDetail.isPresent()).toBeTruthy('shows bond detail');
      const bond = await Bond.fromDetail(page.bondDetail);
      expect(bond.id).toEqual(targetBond.id);
      expect(bond.name).toEqual(targetBond.name.toUpperCase());
    });

    it(`updates bond name (${newBondName}) in details view`, updateBondNameInDetailView);

    it(`shows ${newBondName} in Bonds list`, () => {
      element(by.buttonText('save')).click();
      browser.waitForAngular();
      const expectedText = `${targetBond.id} ${newBondName}`;
      expect(getBondAEltById(targetBond.id).getText()).toEqual(expectedText);
    });

    it(`deletes ${newBondName} from Bonds list`, async () => {
      const bondsBefore = await toBondArray(getPageElts().allBonds);
      const li = getBondLiEltById(targetBond.id);
      li.element(by.buttonText('x')).click();

      const page = getPageElts();
      expect(page.appBonds.isPresent()).toBeTruthy();
      expect(page.allBonds.count()).toEqual(14, 'number of bonds');
      const bondsAfter = await toBondArray(page.allBonds);
      // console.log(await Bond.fromLi(page.allBonds[0]));
      const expectedBonds =  bondsBefore.filter(h => h.name !== newBondName);
      expect(bondsAfter).toEqual(expectedBonds);
      // expect(page.selectedBondSubview.isPresent()).toBeFalsy();
    });

    it(`adds back ${targetBond.name}`, async () => {
      const bondsBefore = await toBondArray(getPageElts().allBonds);
      const numBonds = bondsBefore.length;

      element(by.css('input')).sendKeys(newBondName);
      element(by.buttonText('add')).click();

      const page = getPageElts();
      const bondsAfter = await toBondArray(page.allBonds);
      expect(bondsAfter.length).toEqual(numBonds + 1, 'number of bonds');

      expect(bondsAfter.slice(0, numBonds)).toEqual(bondsBefore, 'Old bonds are still there');

      const maxId = bondsBefore[bondsBefore.length - 1].id;
      expect(bondsAfter[numBonds]).toEqual({id: maxId + 10, name: newBondName});
    });

    it('displays correctly styled buttons', async () => {
      element.all(by.buttonText('x')).then(buttons => {
        for (const button of buttons) {
          // Inherited styles from styles.css
          expect(button.getCssValue('font-family')).toBe('Arial');
          expect(button.getCssValue('border')).toContain('none');
          expect(button.getCssValue('padding')).toBe('5px 10px');
          expect(button.getCssValue('border-radius')).toBe('4px');
          // Styles defined in bonds.component.css
          expect(button.getCssValue('left')).toBe('194px');
          expect(button.getCssValue('top')).toBe('-32px');
        }
      });

      const addButton = element(by.buttonText('add'));
      // Inherited styles from styles.css
      expect(addButton.getCssValue('font-family')).toBe('Arial');
      expect(addButton.getCssValue('border')).toContain('none');
      expect(addButton.getCssValue('padding')).toBe('5px 10px');
      expect(addButton.getCssValue('border-radius')).toBe('4px');
    });

  });

  describe('Progressive bond search', () => {

    beforeAll(() => browser.get(''));

    it(`searches for 'Co'`, async () => {
      getPageElts().searchBox.sendKeys('Co');
      browser.sleep(1000);

      expect(getPageElts().searchResults.count()).toBe(6);
    });

    it(`continues search with 'n'`, async () => {
      getPageElts().searchBox.sendKeys('n');
      browser.sleep(1000);
      expect(getPageElts().searchResults.count()).toBe(2);
    });

    it(`continues search with 'tracto' and gets ${searchTargetBond.name}`, async () => {
      getPageElts().searchBox.sendKeys('tracto');
      browser.sleep(1000);
      const page = getPageElts();
      expect(page.searchResults.count()).toBe(1);
      const bond = page.searchResults.get(0);
      expect(bond.getText()).toEqual(searchTargetBond.name);
    });

    it(`navigates to ${searchTargetBond.name} details view`, async () => {
      const bond = getPageElts().searchResults.get(0);
      expect(bond.getText()).toEqual(searchTargetBond.name);
      bond.click();

      const page = getPageElts();
      expect(page.bondDetail.isPresent()).toBeTruthy('shows bond detail');
      const bond2 = await Bond.fromDetail(page.bondDetail);
      expect(bond2.id).toEqual(searchTargetBond.id);
      expect(bond2.name).toEqual(searchTargetBond.name.toUpperCase());
    });
  });

  async function dashboardSelectTargetBond() {
    const targetBondElt = getPageElts().topBonds.get(targetBondDashboardIndex);
    expect(targetBondElt.getText()).toEqual(targetBond.name);
    targetBondElt.click();
    browser.waitForAngular(); // seems necessary to gets tests to pass for toh-pt6

    const page = getPageElts();
    expect(page.bondDetail.isPresent()).toBeTruthy('shows bond detail');
    const bond = await Bond.fromDetail(page.bondDetail);
    expect(bond.id).toEqual(targetBond.id);
    expect(bond.name).toEqual(targetBond.name.toUpperCase());
  }

  async function updateBondNameInDetailView() {
    // Assumes that the current view is the bond details view.
    addToBondName(nameSuffix);

    const page = getPageElts();
    const bond = await Bond.fromDetail(page.bondDetail);
    expect(bond.id).toEqual(targetBond.id);
    expect(bond.name).toEqual(newBondName.toUpperCase());
  }

});

function addToBondName(text: string): promise.Promise<void> {
  const input = element(by.css('input'));
  return input.sendKeys(text);
}

function expectHeading(hLevel: number, expectedText: string): void {
    const hTag = `h${hLevel}`;
    const hText = element(by.css(hTag)).getText();
    expect(hText).toEqual(expectedText, hTag);
};

function getBondAEltById(id: number): ElementFinder {
  const spanForId = element(by.cssContainingText('li span.badge', id.toString()));
  return spanForId.element(by.xpath('..'));
}

function getBondLiEltById(id: number): ElementFinder {
  const spanForId = element(by.cssContainingText('li span.badge', id.toString()));
  return spanForId.element(by.xpath('../..'));
}

async function toBondArray(allBonds: ElementArrayFinder): Promise<Bond[]> {
  const promisedBonds = await allBonds.map(Bond.fromLi);
  // The cast is necessary to get around issuing with the signature of Promise.all()
  return <Promise<any>> Promise.all(promisedBonds);
}
