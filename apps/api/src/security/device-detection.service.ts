import { Injectable } from '@nestjs/common';
import * as UAParserJS from 'ua-parser-js';  // Import the whole module

@Injectable()
export class DeviceDetectionService {
  formatUserAgent(userAgent: string): string {
    if (!userAgent) return 'Unknown';
    
    // Create a new parser instance correctly
    const parser = new UAParserJS.UAParser(userAgent);
    
    const browser = parser.getBrowser();
    const os = parser.getOS();
    
    const browserName = browser.name || 'Unknown';
    const browserVersion = browser.major || '';
    const osName = os.name || 'Unknown';
    
    return `${browserName} ${browserVersion} / ${osName}`;
  }
}