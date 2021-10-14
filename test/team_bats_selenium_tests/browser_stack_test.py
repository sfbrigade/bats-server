from dotenv import load_dotenv
from threading import Thread
from time import sleep
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import os
from ems import EMSTest
from browserstack.local import Local
# This array 'caps' defines the capabilities browser, device and OS combinations where the test will run
caps=[
    {
      'os_version': 'Big Sur',
      'os': 'OS X',
      'browser': 'chrome',
      'browser_version': '94.0',
      'name': 'Parallel Test1', # test name
      'build': 'browserstack-build-1' # Your tests will be organized within this build
      },
      {
      'os_version': '10',
      'os': 'Windows',
      'browser': 'firefox',
      'browser_version': 'latest',
      'name': 'Parallel Test2',
      'build': 'browserstack-build-1'
      },
      {
      'os_version': 'Big Sur',
      'os': 'OS X',
      'browser': 'safari',
      'browser_version': 'latest',
      'name': 'Parallel Test3',
      'build': 'browserstack-build-1'
}]	 

#run_session function searches for 'BrowserStack' on google.com
def run_session(desired_cap):
    load_dotenv()


    # Creates an instance of Local
    bs_local = Local()

    # You can also use the environment variable - "BROWSERSTACK_ACCESS_KEY".
    bs_local_args = { "key": BROWSERSTACK_ACCESS_KEY, "username": BROWSERSTACK_USERNAME }

    # Starts the Local instance with the required arguments
    bs_local.start(**bs_local_args)

    # Check if BrowserStack local instance is running
    print(bs_local.isRunning())
    # Set this value in your capabilities
    desired_cap = {
    "browserstack.local" : "true"
    }
    # Your test code goes here, from creating the driver instance till the end.
    # i = 0
    # while i < 2 :
    #     bot = EMSTest()
    #     bot.login()
    #     sleep(2)
    #     bot.fill_out_form()
    #     sleep(0.5)
    #     bot.select_hospital()
    #     bot.redirect()
    #     sleep(0.5)
    #     bot.select_hospital()
    #     sleep(0.5)
    #     bot.cancel()
    #     bot.driver.close()
    #     i += 1
    # Stop the Local instance after your test run is completed. 
    bs_local.stop()
    # Other imports and desired_cap definition goes here
    # username = os.environ['BROWSERSTACK_USERNAME'];
    # accessKey = os.environ['BROWSERSTACK_ACCESS_KEY'];
    driver = webdriver.Remote(
    command_executor='https://'+username+':'+accessKey+'@hub-cloud.browserstack.com/wd/hub',
    desired_capabilities=desired_cap
    )
    driver.get("https://www.google.com")
    
    if not "Google" in driver.title:
        raise Exception("Unable to load google page!")
    elem = driver.find_element_by_name("q")
    elem.send_keys("BrowserStack")
    elem.submit()
    try:
        WebDriverWait(driver, 5).until(EC.title_contains("BrowserStack"))
        driver.execute_script('browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed", "reason": "Title matched!"}}')
    except TimeoutException:
        driver.execute_script('browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed", "reason": "Title not matched"}}')
    print(driver.title)
    driver.quit()
    #The Thread function takes run_session function and each set of capability from the caps array as an argument to run each session parallelly
    for cap in caps:
        Thread(target=run_session, args=(cap,)).start()