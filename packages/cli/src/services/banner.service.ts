import type { BannerName } from '@glow/api-types';
import { SettingsRepository } from '@glow/db';
import { Service } from '@glow/di';
import { ErrorReporter } from 'glow-core';

import config from '@/config';

@Service()
export class BannerService {
	constructor(
		private readonly settingsRepository: SettingsRepository,
		private readonly errorReporter: ErrorReporter,
	) {}

	async dismissBanner(bannerName: BannerName) {
		const key = 'ui.banners.dismissed';
		const dismissedBannersSetting = await this.settingsRepository.findOneBy({ key });
		try {
			let value: string;
			if (dismissedBannersSetting) {
				const dismissedBanners = JSON.parse(dismissedBannersSetting.value) as string[];
				const updatedValue = [...new Set([...dismissedBanners, bannerName].sort())];
				value = JSON.stringify(updatedValue);
				await this.settingsRepository.update({ key }, { value, loadOnStartup: true });
			} else {
				value = JSON.stringify([bannerName]);
				await this.settingsRepository.save(
					{ key, value, loadOnStartup: true },
					{ transaction: false },
				);
			}
			config.set(key, value);
		} catch (error) {
			this.errorReporter.error(error);
		}
	}
}
